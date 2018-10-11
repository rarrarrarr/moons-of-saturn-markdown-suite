import * as vscode from 'vscode';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import * as changeCase from 'change-case';
const writeFile = util.promisify(fs.writeFile);
const writeFolder = util.promisify(fs.mkdir);

export class Mos {

    private _filename: string;
    private _projectRoot: string;
    private _currentMoS: string;
    private _moons: string[] = ['aegaeon', 'aegir', 'albiorix', 'anthe', 'atlas', 'bebhionn', 'bergelmir', 'bestla', 'calypso', 'daphnis', 'dione', 'enceladus', 'epimetheus', 'erriapus', 'farbauti', 'fenrir', 'fornjot', 'greip', 'hati', 'helene', 'hyperion', 'hyrrokkin', 'iapetus', 'ijiraq', 'janus', 'jarnsaxa', 'kari', 'kiviuq', 'loge', 'methone', 'mimas', 'mundilfari', 'narvi', 'paaliaq', 'pallene', 'pan', 'pandora', 'phoebe', 'polydeuces', 'prometheus', 'rhea', 's/2004 s12', 's/2004 s13', 's/2004 s17', 's/2004 s7', 's/2006 s1', 's/2006 s3', 's/2007 s2', 's/2007 s3', 'siarnaq', 'skathi', 'skoll', 'surtur', 'suttungr', 'tarqeq', 'tarvos', 'telesto', 'tethys', 'thrymr', 'titan', 'ymir'];

    constructor() {
        this._projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
        this._currentMoS = this.getCurrentMoS();
    }

    //return the last folder name, alphabetically, since that will represent the current MoS
    private getCurrentMoS(): string {
        const isDirectory = source => fs.lstatSync(source).isDirectory();
        const getDirectories = source => fs.readdirSync(source)
            .map(name => path.join(source, name))
            .filter(isDirectory);

        let currentMoS = getDirectories(this._projectRoot)
            .sort()
            .slice(-1)[0]
            .split(path.sep)
            .slice(-1)[0];

        console.log(`found folder: ${currentMoS}`);
        return currentMoS;
    }

    private getCurrentMoSPath(): string {
        return path.join(this._projectRoot, this._currentMoS);
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
        return changeCase.titleCase(this._filename);
    }

    private generateMdTemplate(): string {
        let mdTemplate =
            `# ${this.getMdTitle()}

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

    private getNextMoS(): string {
        return this._moons[this._moons.indexOf(this._currentMoS) + 1];
    }

    public createNewMdFldr(filename: string) {
        this._filename = filename;

        //TODO: make these promises, I guess?
        this.createFolder(this.getMdFldrPath());
        this.createFile(this.getMdPath(), this.generateMdTemplate());

        const editor = vscode.workspace.openTextDocument(this.getMdPath())
            .then((doc) => vscode.window.showTextDocument(doc, 0, false));

        if (!editor) {
            vscode.window.showErrorMessage(`Could not open ${this.getMdPath()}`);
        }
    }

    public createNewMoS(): string | undefined {
        this._currentMoS = this.getNextMoS();
        this.createFolder(this.getCurrentMoSPath());
        this.createFile(path.join(this.getCurrentMoSPath(), '_later.md'), '');
        this.createFile(path.join(this.getCurrentMoSPath(), `${this._currentMoS}.md`), '');
        return this._currentMoS;
    }
}