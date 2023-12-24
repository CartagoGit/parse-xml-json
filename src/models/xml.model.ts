import { getFileText } from '../helpers/read-file';
import { FileType } from '../interfaces/basic.interface';

interface XmlProps {
	name: string;
	fileName: string;
	content: string;
	src: string;
	extension: string;
	type: FileType;
	version: string;
	xmlTag: string | null;
	encoding: string | null;
	children: XmlChild[];
	parent: XmlFile | XmlChild | null;
	level: number;
}

export class XmlFile implements XmlProps {
	// ANCHOR - Properties
	public readonly name: string;
	public readonly fileName: string;
	public readonly content: string;
	public readonly src: string;
	public readonly extension: string;
	public readonly type: FileType = 'xml';
	public readonly version: string;
	public readonly xmlTag: string | null = null;
	public readonly encoding;
	public readonly children: XmlChild[] = [];
	public readonly parent: XmlFile | null = null;
	public readonly level = 0;

	// ANCHOR - Constructor
	constructor(src: string) {
		this.src = src;
		this.content = getFileText(this.src);
		this.fileName = this.src.split('/').pop() || '';
		[this.name, this.extension] = this.fileName.split('.');
		this.xmlTag = this._getXmlTag();
		this.version = this._getVersionXml();
		this.encoding = this._getEncodingXml();
		this.children = this._getChildrenTags();

		console.log(this);
	}

	// ANCHOR - Methods
	private _getXmlTag(): string | null {
		const xmlTagPattern = /<\?xml.*\?>/;
		const xmlTag = this.content.match(xmlTagPattern)?.[0] ?? null;
		return xmlTag;
	}

	private _getVersionXml(): string {
		const versionPattern = /version\s*=\s*"(.*?)"/;
		const version = this.xmlTag?.match(versionPattern)?.[1] ?? 'Unknown';
		return version;
	}

	private _getEncodingXml(): string | null {
		const encodingPattern = /encoding\s*=\s*"(.*?)"/;
		const encoding = this.xmlTag?.match(encodingPattern)?.[1] ?? null;
		return encoding;
	}

	private _getChildrenTags(): XmlChild[] {
		let text = this.content
			.replace(/[\n\r]/g, '')
			.replace(/>\s*</g, '><')
			.trim();
		if (this.xmlTag) text = text.replace(this.xmlTag, '');
		const tags: XmlChild[] = [];
		while (!!text) {
			const indexEnd = text.indexOf('>');
			const openTag = text.slice(0, indexEnd + 1);
			if (openTag.includes('/>')) {
				tags.push(
					new XmlChild({
						tag: openTag.replace(/[<\/\>]/g, '')?.trim() ?? '',
						content: openTag,
						parent: this,
						level: this.level + 1,
					})
				);
				text = text.slice(indexEnd + 1);
			} else {
				const nameTag = openTag.replace(/[<\/\>]/g, '')?.trim() ?? '';
				let textSearching = text.slice(indexEnd + 1);

				while (true) {
					const openSameTag = textSearching.indexOf('<' + nameTag);
					const closeSameTag = textSearching.indexOf('</' + nameTag);
					if (openSameTag !== -1 && openSameTag < closeSameTag) {
						textSearching = textSearching.slice(closeSameTag + 1);
					} else {
						const textTag = textSearching.slice(0, closeSameTag);
						const xmlChild = new XmlChild({
							tag: nameTag,
							content: textTag,
							parent: this,
							level: this.level + 1,
						});
						tags.push(xmlChild);
						textSearching = textSearching.slice(closeSameTag + 1);
						const lastTagIndex = textSearching.indexOf('>');
						text = textSearching.slice(lastTagIndex + 1);
						break;
					}
				}
			}
		}

		return tags;
	}
}

class XmlChild {
	public readonly name: string;
	public readonly content: string;
	public readonly children: XmlChild[] = [];
	public readonly parent: XmlFile | XmlChild | null = null;
	public readonly level;
	public readonly openTag: string;
	public readonly closeTag: string | null = null;
	public readonly isSelfClosing: boolean;

	constructor(props: {
		tag: string;
		content: string;
		parent: XmlFile | XmlChild;
		level: number;
	}) {
		const { tag, content, parent, level } = props;
		this.name = tag.split(' ')[0];
		this.isSelfClosing = content.endsWith('/>');

		// this.openTag = this.isSelfClosing ? content : `<${tag}>`;
		this.openTag = 'ee'
		// this.closeTag = this.isSelfClosing ? null : `</${this.name}>`;
		this.closeTag = 'asdsad'
		this.parent = parent;
		this.content = content;
		this.level = level;
	}
}
