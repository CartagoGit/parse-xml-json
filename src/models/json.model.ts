import { FileType } from "../interfaces/basic.interface";

export class JsonFile {
    public readonly name : string;
    public readonly src : string;
    public readonly type : FileType = 'json';
	constructor(src: string) {
        this.src = src;
        this.name = src.split('/').pop() || '';
    }
}
