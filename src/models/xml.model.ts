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
	children: string[];
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
	// public readonly children: XmlItem[] = [];
	public readonly children: string[] = [];
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

	private _getChildrenTags(): string[] {
		const elementPattern = /(<[^\/>]+\/>|<[^>]+>)/g;
		let matches = this.content.trim().match(elementPattern);
		if (this.xmlTag) {
			matches?.shift();
		}
		const elements = matches ?? [];
		let tags: string[] = [];
		for (let i = 0; i < elements.length; i++) {
			const element = elements[i];
			const inner = element.replace(/[<\/\>]/g, '')?.trim() ?? '';
			const nameTag = inner.split(' ')[0];
			if (element.includes('/>')) {
				tags.push(nameTag);
			} else {
				const searchTag = nameTag;
				let counter = 1;
				for (let j = i + 1; j < elements.length; j++) {
					const elementInner = elements[j];
					if (elementInner.includes(searchTag)) {
						if (elementInner.includes('/')) {
							counter--;
							if (counter === 0) {
								tags.push(nameTag);
								i = j;
								break;
							} else counter++;
						}
					}
				}
			}
		}
		return tags;
	}
}

class XmlChild {
	
}
