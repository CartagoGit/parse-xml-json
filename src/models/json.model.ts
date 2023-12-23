import { FileType } from "../interfaces/basic.interface";

export class JsonFile {
    public readonly name : string;
    public readonly url : string;
    public readonly type : FileType = 'json';
	constructor(url: string) {}
}
