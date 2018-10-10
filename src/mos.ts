import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
const writeFile = util.promisify(fs.writeFile);
const writeFolder = util.promisify(fs.mkdir);

export class Mos {

    private _filename: string;
    private _projectRoot: string;

    private getCurrentMoS() {
        return `farbauti`;  //TODO: replace this w/ a function to get all of the folder names in the workspace and return the highest one
    }

    private getCurrentMoSPath(): string {
        return path.join(this._projectRoot, this.getCurrentMoS());
    }

    private getMdFldrPath(): string {
        return path.join(this.getCurrentMoSPath(), this.getMdFldrName());
    }

    private getMdFldrName(): string {
        return `${this._filename}.md.fldr`;
    }

    private getMdName(): string {
        return `${this._filename}.md`;
    }

    private getMdPath(): string {
        return path.join(this.getMdFldrPath(), this.getMdName());
    }

    private getMdTitle(): string {
        return `${this._filename} - TODO: Titlecase this`;
    }

    private generateMdTemplate(): string {
        let mdTemplate = `# ${this.getMdTitle()}

        ## Header 1
        
        ## Minutes
        
        ## References
        
        <!-- Links -->
        `;

        return mdTemplate;
    }

    private createFolder(path: string) {
        writeFolder(path)
            .then(() => console.log(`${path} created successfully`))
            .catch(error => console.error(error));
    }

    private createFile(path: string, content: string) {
        writeFile(path, content)
            .then(() => console.log(`${path} created successfully.`))
            .catch(error => console.error(error));
    }


    public createNewMdFldr(filename: string) {
        this._filename = filename;
        this._projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;

        //TODO: make these promises, I guess?
        this.createFolder(this.getMdFldrPath());
        this.createFile(this.getMdPath(), this.generateMdTemplate());

        const editor = vscode.workspace.openTextDocument(this.getMdPath())
            .then((doc) => vscode.window.showTextDocument(doc, 0, false));

        if (!editor) {
            vscode.window.showErrorMessage(`Could not open ${this.getMdPath()}`);
        }
    }
}