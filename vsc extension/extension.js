// Import the necessary modules from the VS Code extension API
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

// This method is called when your extension is activated
function activate(context) {
  // Register a command to execute Python code
  const runPythonInTerminal = vscode.commands.registerCommand('extension.runPythonInTerminal', () => {
    // Get the active text editor
    const activeTextEditor = vscode.window.activeTextEditor;

    if (!activeTextEditor) {
      // If there's no active text editor, show an error message
      vscode.window.showErrorMessage('No active text editor found.');
      return;
    }

    // Get the workspace folder of the active text editor
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeTextEditor.document.uri);

    if (!workspaceFolder) {
      // If the workspace folder is not found, show an error message
      vscode.window.showErrorMessage('No workspace folder found.');
      return;
    }

    // Get the path of the workspace folder
    const workspaceFolderPath = workspaceFolder.uri.fsPath;

    // Get the active document's file path
    const activeDocumentFilePath = activeTextEditor.document.uri.fsPath;

    // Get the directory path of the active document
    const activeDocumentDir = path.dirname(activeDocumentFilePath);

    // Read all files in the same directory as the Python file
    fs.readdir(activeDocumentDir, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage('Error reading files in the directory.');
        return;
      }

      // Display the list of files found in the directory in the terminal
      const filesList = files.join('\n');
      vscode.window.showInformationMessage(`Files in the directory:\n${filesList}`);
    });

    // Execute Python code in the terminal using the workspace folder as the CWD
    const terminal = vscode.window.createTerminal({
      cwd: workspaceFolderPath,
      name: 'Python Terminal',
    });

    terminal.sendText('python', true); // Start the Python interpreter
    terminal.show(); // Show the terminal
  });

  // Add the command to the context
  context.subscriptions.push(runPythonInTerminal);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};