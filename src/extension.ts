import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { spawn } from 'child_process'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function activate (context: vscode.ExtensionContext) {
  const skipMaps = [
    { config: 'formatting.blankBeforeDeclaration', arg: 'blank-before-declaration' },
    { config: 'formatting.simplifyStrings', arg: 'simplify-strings' }
  ]

  const ruleMaps = [
    { config: 'formatting.alignment.alignAssignments', arg: 'align-assignments' },
    { config: 'formatting.alignment.alignComments', arg: 'align-comments' },
    { config: 'formatting.oneLineArguments', arg: 'one-line-arguments' },
    { config: 'formatting.preserveOneLineStatements', arg: 'preserve-one-line' }
  ]

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
          console.log('PrettyPHP access check failed: %s', err)
          vscode.window.showErrorMessage('PrettyPHP not found: ' + formatterPath)
            .then(
              () => { },
              () => { }
            )
          reject(new Error('PrettyPHP not found'))
          return
        }
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
        } else {
          console.log('%s failed (exit status: %i)', php.spawnfile, code)
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
