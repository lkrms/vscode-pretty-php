import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	function formatDocument(
		document: vscode.TextDocument,
		insertSpaces: boolean,
		tabSize: number
	): Thenable<vscode.TextEdit[]> {
		return new Promise((resolve, reject) => {
			const config = vscode.workspace.getConfiguration("pretty-php"),
				text = document.getText(),
				php = spawn(
					config.get("php") || "php",
					[
						// Send startup errors to STDERR so they don't taint our code
						"-ddisplay_errors=stderr",

						// Format code with the short form of PHP's open tag (`<?`)
						"-dshort_open_tag=On",

						path.resolve(__dirname, "../bin/pretty-php.phar"),

						// Pass the editor's indent type and size to PrettyPHP
						(insertSpaces ? "-s" : "-t") + normaliseTabSize(tabSize),

						// Silence PrettyPHP unless there's an error
						"-qqq",
					]);

			console.log("Spawned:", ...php.spawnargs);

			let stdout = "";
			php.stdout.setEncoding("utf8");
			php.stdout.on("data", (chunk) => stdout += chunk);

			let stderr = "";
			php.stderr.setEncoding("utf8");
			php.stderr.on("data", (chunk) => stderr += chunk);

			php.on("close", (code, signal) => {
				if (stderr.length) {
					console.error(stderr);
				}
				if (code === 0) {
					console.log("%s succeeded (output length: %i)", php.spawnfile, stdout.length);
					if (stdout.length && stdout !== text) {
						resolve([new vscode.TextEdit(new vscode.Range(
							document.lineAt(0).range.start,
							document.lineAt(document.lineCount - 1).rangeIncludingLineBreak.end
						), stdout)]);
					} else {
						console.log("Nothing to change");
						resolve([]);
					}
				} else {
					console.log("%s failed (exit status: %i)", php.spawnfile, code);
					reject(stderr);
				}
			});

			php.stdin.write(document.getText());
			php.stdin.end();
		});
	}

	function normaliseTabSize(
		tabSize: number
	): number {
		return tabSize > 4
			? 8
			: (tabSize > 2
				? 4
				: 2);
	}

	vscode.languages.registerDocumentFormattingEditProvider([
		"php"
	], {
		provideDocumentFormattingEdits(
			document: vscode.TextDocument,
			options: vscode.FormattingOptions,
			token: vscode.CancellationToken
		): Thenable<vscode.TextEdit[]> {
			return formatDocument(document, options.insertSpaces, options.tabSize);
		}
	});

	let formatCommand = vscode.commands.registerCommand('pretty-php.format', () => {
		const document = vscode.window.activeTextEditor?.document;
		if (document) {
			const options = vscode.window.activeTextEditor?.options,
				insertSpaces = typeof options?.insertSpaces === "boolean" ? options.insertSpaces : true,
				tabSize = typeof options?.tabSize === "number" ? options.tabSize : 4;
			formatDocument(document, insertSpaces, tabSize).then((edits: vscode.TextEdit[]) => {
				let edit = new vscode.WorkspaceEdit();
				edit.set(document.uri, edits);
				vscode.workspace.applyEdit(edit);
			});
		}
	});

	context.subscriptions.push(formatCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }

