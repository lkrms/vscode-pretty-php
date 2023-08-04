import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import * as which from 'which'
import { spawn } from 'child_process'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function activate (context: vscode.ExtensionContext) {
  const skipMaps = [
    { config: 'formatting.declarationSpacing', arg: 'declaration-spacing' },
    { config: 'formatting.simplifyStrings', arg: 'simplify-strings' },
    { config: 'formatting.magicCommas', arg: 'magic-commas' }
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
    { config: 'formatting.preserveOneLineStatements', arg: 'preserve-one-line' }
  ]

  function migrateConfiguration<T0, T1> (from: string, to: string, valueCallback?: (value: any) => any): void {
    const config = vscode.workspace.getConfiguration('pretty-php')
    const currentFrom = config.inspect<T0>(from)
    const currentTo = config.inspect<T1>(to)
    maybeUpdateConfiguration(config, from, to, currentFrom?.globalValue, currentTo?.globalValue, valueCallback, true)
    maybeUpdateConfiguration(config, from, to, currentFrom?.workspaceValue, currentTo?.workspaceValue, valueCallback, false)
  }

  function maybeUpdateConfiguration (
    config: vscode.WorkspaceConfiguration,
    from: string,
    to: string,
    fromValue: any,
    toValue: any,
    valueCallback: ((value: any) => any) | undefined,
    global: boolean): void {
    // Old setting not set?
    if (fromValue == null) {
      return
    }

    if (valueCallback != null) {
      // Replace old value with equivalent new value
      fromValue = valueCallback(fromValue)
      // Remove old setting if old value is equivalent to being unset
      if (fromValue == null) {
        void config.update(from, undefined, global)
        return
      }
    }

    // New setting already set?
    if (toValue != null) {
      // Remove old setting if values match, otherwise leave for manual removal
      if (fromValue === toValue) {
        void config.update(from, undefined, global)
      }
      return
    }

    void config.update(to, fromValue, global)
      .then(() => { void config.update(from, undefined, global) })
  }

  function formatDocument (
    document: vscode.TextDocument,
    insertSpaces: boolean,
    tabSize: number,
    ...prettyPhpArgs: string[]
  ): Thenable<vscode.TextEdit[]> {
    return new Promise<vscode.TextEdit[]>(resolve => {
      const args = getCommand(document, insertSpaces, tabSize)
      const command = args?.shift()
      if (args === undefined || command === undefined) {
        resolve([])
        return
      }
      args.push(...prettyPhpArgs)

      const text = document.getText()
      const php = spawn(
        command, [
          ...args,
          '-qqq', // Silence PrettyPHP unless there's an error
          '--',
          '-' // Specify that code to format should be taken from the standard input
        ]
      )

      log.info('Spawned:', ...php.spawnargs)

      let stdout = ''
      php.stdout.setEncoding('utf8')
      php.stdout.on('data', (chunk: string) => { stdout += chunk })

      let stderr = ''
      php.stderr.setEncoding('utf8')
      php.stderr.on('data', (chunk: string) => { stderr += chunk })

      php.on('close', (code: number) => {
        if (stderr.length > 0) {
          log.error(stderr)
        }
        if (code === 0) {
          log.info(`${php.spawnfile} succeeded (output length: ${stdout.length})`)
          if (stdout.length > 0 && stdout !== text) {
            resolve([
              new vscode.TextEdit(new vscode.Range(
                document.lineAt(0).range.start,
                document.lineAt(document.lineCount - 1).rangeIncludingLineBreak.end
              ), stdout)
            ])
          } else {
            log.info('Nothing to change')
            resolve([])
          }
        } else if (code === 2) {
          log.info(`${php.spawnfile} reported invalid input (exit status: ${code})`)
          resolve([])
        } else {
          log.error(`${php.spawnfile} failed (exit status: ${code})`)
          showErrorMessage('PrettyPHP failed: ' + stderr)
          resolve([])
        }
      })

      php.stdin.write(text)
      php.stdin.end()
    })
  }

  function getCommand (
    document?: vscode.TextDocument,
    insertSpaces?: boolean,
    tabSize?: number
  ): string[] | undefined {
    const php = getPath('PHP', 'phpPath', 'php', true)
    if (php === undefined) {
      return
    }
    const formatter = getPath('formatter', 'formatterPath', path.resolve(__dirname, '../bin/pretty-php.phar'), false)
    if (formatter === undefined) {
      return
    }

    const prettyPhpArgs: string[] = [
      php,
      '-ddisplay_errors=stderr', // Send startup errors to STDERR so they don't taint the code
      '-dshort_open_tag=On', // Format code with the short form of PHP's open tag (`<?`)
      formatter
    ]

    const config = vscode.workspace.getConfiguration('pretty-php')
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

    maybeAddArgs(prettyPhpArgs, 'formatting.heredocIndentation', '-h')

    const sortImportsBy = config.get<string>('formatting.sortImportsBy')
    if (sortImportsBy === 'off') {
      prettyPhpArgs.push('-M')
    } else {
      maybeAddArgs(prettyPhpArgs, 'formatting.sortImportsBy', '-m')
    }

    const psr12 = config.get<boolean>('formatting.psr12')
    if (psr12 != null && psr12) {
      prettyPhpArgs.push('--psr12')
    }

    const honourConfigurationFiles = config.get<boolean>('honourConfigurationFiles')
    if (honourConfigurationFiles != null && !honourConfigurationFiles) {
      prettyPhpArgs.push('--no-config')
    }

    if (document !== undefined) {
      const filename = document.uri.scheme === 'file' ? document.uri.fsPath : null
      if (filename !== null) {
        prettyPhpArgs.push('-F', filename)
      }
    }

    if (insertSpaces !== undefined && tabSize !== undefined) {
      // Pass the editor's indent type and size to PrettyPHP
      prettyPhpArgs.push((insertSpaces ? '-s' : '-t') + String(normaliseTabSize(tabSize)))
    }

    return prettyPhpArgs
  }

  function maybeAddArgs (args: string[], setting: string, option: string): void {
    const config = vscode.workspace.getConfiguration('pretty-php')
    const value = config.get<string>(setting)
    if (value != null && value !== config.inspect<string>(setting)?.defaultValue) {
      args.push(option, value)
    }
  }

  function getPath (
    name: string,
    setting: string,
    defaultPath: string,
    executable: boolean
  ): string | undefined {
    const settingPath = vscode.workspace.getConfiguration('pretty-php').get<string>(setting)
    const file = settingPath != null && settingPath !== '' ? settingPath : defaultPath
    if (path.isAbsolute(file)) {
      try {
        fs.accessSync(file, fs.constants.R_OK | (executable ? fs.constants.X_OK : 0))
        return file
      } catch { }
    } else {
      const pathPath = which.sync(file, { nothrow: true })
      if (pathPath !== null) {
        return pathPath
      }
    }
    setting = 'pretty-php.' + setting
    showErrorMessage(`'${file}' not found. Use the '${setting}' setting to configure the ${name} path.`, setting)
  }

  function showErrorMessage (message: string, setting?: string): void {
    if (setting === undefined) {
      void vscode.window.showErrorMessage(message)
    } else {
      const goToSetting = 'Go to setting'
      void vscode.window.showErrorMessage(message, goToSetting)
        .then(item => {
          if (item === goToSetting) {
            void vscode.commands.executeCommand('workbench.action.openSettings', setting)
          }
        })
    }
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

  const log = vscode.window.createOutputChannel('PrettyPHP', { log: true })

  migrateConfiguration<boolean, boolean>(
    'formatting.blankBeforeDeclaration',
    'formatting.declarationSpacing'
  )

  migrateConfiguration<boolean, string>(
    'formatting.indentHeredocs',
    'formatting.heredocIndentation',
    function (value: any): string | undefined {
      switch (value) {
        case true:
          return undefined
        case false:
          return 'none'
      }
    }
  )

  migrateConfiguration<boolean, string>(
    'formatting.sortImports',
    'formatting.sortImportsBy',
    function (value: any): string | undefined {
      switch (value) {
        case true:
          return undefined
        case false:
          return 'off'
      }
    }
  )

  vscode.languages.registerDocumentFormattingEditProvider('php', {
    provideDocumentFormattingEdits (
      document: vscode.TextDocument, options: vscode.FormattingOptions
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
