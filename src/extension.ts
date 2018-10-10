//'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Mos } from "./mos";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "moons-of-saturn-markdown-suite" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let createNewMoSCommand = vscode.commands.registerCommand('mos.createNewMoS', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Create new MoS');
    });

    let createNewMdFldrCommand = vscode.commands.registerCommand('mos.createNewMdFldr', async () => {

        const fileName = await vscode.window.showInputBox(
            {
                placeHolder: 'camelCaseNamesAreBest',
                prompt: 'Name for the new markdown document',
                validateInput: function validate(name: string): string | null {
                    if (!name) {
                        return 'Name is required';
                    }
                    if (name.includes(' ')) {
                        return 'Spaces are not allowed';
                    }
                    // no errors
                    return null;
                },
            });

        if (!fileName) {
            console.info('user closed filename input');
            return;
        }

        const mos = new Mos();
        mos.createNewMdFldr(fileName);
    });

    let createOpenMoSVolumeCommand = vscode.commands.registerCommand('mos.openMoSVolume', async () => {
        let uri = vscode.Uri.file('/Volumes/moons-of-saturn'); //TODO: load this location from user preferences
        let success = await vscode.commands.executeCommand('vscode.openFolder', uri, true);
        console.log(success);
    });

    context.subscriptions.push(createNewMoSCommand);
    context.subscriptions.push(createNewMdFldrCommand);
    context.subscriptions.push(createOpenMoSVolumeCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
}