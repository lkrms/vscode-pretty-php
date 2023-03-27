import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { spawn } from 'child_process'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function activate (context: vscode.ExtensionContext) {
  const skipMaps = [
    { config: 'formatting.declarationSpacing', arg: 'declaration-spacing' },
    { config: 'formatting.simplifyStrings', arg: 'simplify-strings' },
    { config: 'formatting.magicCommas', arg: 'magic-commas' },
    { config: 'formatting.indentHeredocs', arg: 'indent-heredocs' }
  ]

  const ruleMaps = [
    { config: 'formatting.blankBeforeReturn', arg: 'blank-before-return' },
    { config: 'formatting.strictLists', arg: 'strict-lists' },
    { config: 'formatting.alignment.alignAssignments', arg: 'align-assignments' },
    { config: 'formatting.alignment.alignChains', arg: 'align-chains' },
    { config: 'formatting.alignment.alignComments', arg: 'align-comments' },
    { config: 'formatting.alignment.alignFn', arg: 'align-fn' },
    { config: 'formatting.alignment.alignLists', arg: 'align-lists' },
    { config: 'formatting.alignment.alignTernaryOperators', arg: 'align-ternary' },
    { config: 'formatting.oneLineArguments', arg: 'one-line-arguments' },
    { config: 'formatting.preserveOneLineStatements', arg: 'preserve-one-line' }
  ]

  function migrateConfiguration<T> (from: string, to: string): void {
    const config = vscode.workspace.getConfiguration('pretty-php')
    const currentFrom = config.inspect<T>(from)
    const currentTo = config.inspect<T>(to)
    maybeUpdateConfiguration(config, from, to, currentFrom?.globalValue, currentTo?.globalValue, true)
    maybeUpdateConfiguration(config, from, to, currentFrom?.workspaceValue, currentTo?.workspaceValue, false)
  }

  function maybeUpdateConfiguration (
    config: vscode.WorkspaceConfiguration,
    from: string,
    to: string,
    fromValue: any,
    toValue: any,
    global: boolean): void {
    // Old setting not set?
    if (fromValue == null) {
      return
    }

    // New setting already set?
    if (toValue != null) {
      // Remove old setting if values match, otherwise leave it for manual removal
      if (fromValue === toValue) {
        config.update(from, undefined, global).then(() => { }, () => { })
      }

      return
    }

    config.update(to, fromValue, global).then(
      () => { config.update(from, undefined, global).then(() => { }, () => { }) },
      (reason) => { console.error('Could not migrate setting %s to %s: %s', from, to, reason) }
    )
  }

  function formatDocument (
    document: vscode.TextDocument,
    insertSpaces: boolean,
    tabSize: number,
    ...prettyPhpArgs: string[]
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      const config = vscode.workspace.getConfiguration('pretty-php')
      const formatterPath = config.get<string>('formatterPath')

      if (formatterPath != null && formatterPath !== '') {
        try {
          fs.accessSync(formatterPath, fs.constants.R_OK)
        } catch (err) {
          console.error('PrettyPHP access check failed: %s', err)
          vscode.window.showErrorMessage('PrettyPHP not found: ' + formatterPath)
            .then(
              () => { },
              () => { }
            )
          reject(new Error('PrettyPHP not found'))
          return
        }
      }

      const formatterArguments = config.get<string[]>('formatterArguments')
      if (formatterArguments != null) {
        prettyPhpArgs.push(...formatterArguments)
      }

      skipMaps.forEach((map) => {
        const enabled = config.get<boolean>(map.config)
        if (enabled == null || !enabled) {
          prettyPhpArgs.push('-i', map.arg)
        }
      })

      ruleMaps.forEach((map) => {
        const enabled = config.get<boolean>(map.config)
        if (enabled != null && enabled) {
          prettyPhpArgs.push('-r', map.arg)
        }
      })

      const sortImports = config.get<boolean>('formatting.sortImports')
      if (sortImports != null && !sortImports) {
        prettyPhpArgs.push('-M')
      }

      const phpPath = config.get<string>('phpPath')
      const text = document.getText()
      const php = spawn(
        phpPath != null && phpPath !== '' ? phpPath : 'php',
        [
          // Send startup errors to STDERR so they don't taint our code
          '-ddisplay_errors=stderr',

          // Format code with the short form of PHP's open tag (`<?`)
          '-dshort_open_tag=On',

          formatterPath != null && formatterPath !== '' ? formatterPath : path.resolve(__dirname, '../bin/pretty-php.phar'),

          ...prettyPhpArgs,

          // Pass the editor's indent type and size to PrettyPHP
          (insertSpaces ? '-s' : '-t') + String(normaliseTabSize(tabSize)),

          // Silence PrettyPHP unless there's an error
          '-qqq'
        ],
        {
          env: {
            ...process.env,
            ...{
              // Remove PrettyPHP settings from the environment to prevent confusing/unstable behaviour
              pretty_php_skip: undefined, // eslint-disable-line @typescript-eslint/naming-convention
              pretty_php_rule: undefined // eslint-disable-line @typescript-eslint/naming-convention
            }
          }
        })

      console.log('Spawned:', ...php.spawnargs)

      let stdout = ''
      php.stdout.setEncoding('utf8')
      php.stdout.on('data', (chunk: string) => { stdout += chunk })

      let stderr = ''
      php.stderr.setEncoding('utf8')
      php.stderr.on('data', (chunk: string) => { stderr += chunk })

      php.on('close', (code: number, signal: string) => {
        if (stderr.length > 0) {
          console.error(stderr)
        }
        if (code === 0) {
          console.log('%s succeeded (output length: %i)', php.spawnfile, stdout.length)
          if (stdout.length > 0 && stdout !== text) {
            resolve([
              new vscode.TextEdit(new vscode.Range(
                document.lineAt(0).range.start,
                document.lineAt(document.lineCount - 1).rangeIncludingLineBreak.end
              ), stdout)
            ])
          } else {
            console.log('Nothing to change')
            resolve([])
          }
        } else if (code === 2) {
          console.log('%s reported invalid input (exit status: %i)', php.spawnfile, code)
          reject(new Error('PrettyPHP reported invalid input'))
        } else {
          console.error('%s failed (exit status: %i)', php.spawnfile, code)
          vscode.window.showErrorMessage('PrettyPHP failed: ' + stderr)
            .then(
              () => { },
              () => { }
            )
          reject(new Error('PrettyPHP failed'))
        }
      })

      php.stdin.write(document.getText())
      php.stdin.end()
    })
  }

  function normaliseTabSize (
    tabSize: number
  ): number {
    return tabSize > 4
      ? 8
      : (tabSize > 2
          ? 4
          : 2)
  }

  function handleCommand (
    ...prettyPhpArgs: string[]
  ): void {
    const document = vscode.window.activeTextEditor?.document
    if (document != null) {
      const options = vscode.window.activeTextEditor?.options
      const insertSpaces = typeof options?.insertSpaces === 'boolean' ? options.insertSpaces : true
      const tabSize = typeof options?.tabSize === 'number' ? options.tabSize : 4
      formatDocument(document, insertSpaces, tabSize, ...prettyPhpArgs)
        .then((edits: vscode.TextEdit[]) => {
          const edit = new vscode.WorkspaceEdit()
          edit.set(document.uri, edits)
          vscode.workspace.applyEdit(edit)
            .then(() => { }, () => { })
        }, () => { })
    }
  }

  migrateConfiguration<boolean>('formatting.blankBeforeDeclaration', 'formatting.declarationSpacing')

  vscode.languages.registerDocumentFormattingEditProvider([
    'php'
  ], {
    provideDocumentFormattingEdits (
      document: vscode.TextDocument,
      options: vscode.FormattingOptions,
      token: vscode.CancellationToken
    ): Thenable<vscode.TextEdit[]> {
      return formatDocument(document, options.insertSpaces, options.tabSize)
    }
  })

  context.subscriptions.push(
    vscode.commands.registerCommand('pretty-php.format', () => handleCommand()),
    vscode.commands.registerCommand('pretty-php.formatWithoutNewlines', () => handleCommand('-N'))
  )
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function deactivate () { }
