import { getFileText } from '../helpers/files-helpers';
import { patternCommentsJson } from '../helpers/helpers';
import { FileProps, FileType } from '../interfaces/basic.interface';

interface JsonProps extends FileProps<JsonFile, JsonChild> {}

export class JsonFile implements JsonProps {
	// ANCHOR : Properties
	public readonly name: string;
	public readonly fileName: string;
	public readonly content: string;
	public readonly src: string;
	public readonly extension: string;
	public readonly type: FileType = 'json';
	public readonly children: JsonChild[] = [];
	public readonly parent: JsonFile | null = null;
	public readonly level = 0;

	// Can be a source for a file or a string text to parse
	constructor(data: { src?: string; text?: string }) {
		let { src, text } = data;
		if (!!text) {
			text = text.trim().replace(patternCommentsJson, ''); // Remove comments
		}
		this.src = text ? 'Test json text' : src ?? '';
		this.content =
			text ??
			getFileText(this.src).trim().replace(patternCommentsJson, ''); // Remove comments
		this.fileName = this.src.split('/').pop() || '';
		[this.name, this.extension] = this.fileName.split('.');
		// this.children = XmlHelpers.getChildrenTags(this);
		this.children = [];
	}
}

export class JsonChild {}
