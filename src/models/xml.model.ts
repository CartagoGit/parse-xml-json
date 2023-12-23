import { FileType } from "../interfaces/basic.interface";

export class XmlFile {
    public readonly name : string;
    public readonly url : string;
    public readonly type : FileType = 'xml';
	constructor(url: string) {}
}
