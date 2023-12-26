import { createFile, getFileText } from '../helpers/files-helpers';
import { patternCommentsXml } from '../helpers/helpers';
import { FileProps, FileType } from '../interfaces/basic.interface';

interface XmlProps extends FileProps<XmlFile, XmlChild> {
	version: string;
	xmlTag: string | null;
	encoding: string | null;
}

export class XmlFile implements XmlProps {
	// ANCHOR - Properties
	private _name: string;
	get name(): string {
		return this._name;
	}
	private _fileName: string;
	get fileName(): string {
		return this._fileName;
	}
	private _content: string;
	get content(): string {
		return this._content;
	}
	private _src: string;
	get src(): string {
		return this._src;
	}

	private _extension: string;
	get extension(): string {
		return this._extension;
	}

	public readonly type: FileType = 'xml';
	public readonly version: string;
	public readonly xmlTag: string | null = null;
	public readonly encoding;
	private _children: XmlChild[] = [];
	get children(): XmlChild[] {
		return [...this._children];
	}
	public readonly level = 0;

	// ANCHOR - Constructor
	// Can be a source for a file or a string text to parse
	constructor(data: { src?: string; text?: string }) {
		let { src, text } = data;
		if (!!text) {
			text = text.trim().replace(patternCommentsXml, ''); // Remove comments
		}
		this._src = text ? 'xmlFromText' : src ?? '';
		this._content =
			text ??
			getFileText(this.src).trim().replace(patternCommentsXml, ''); // Remove comments
		this._fileName = this.src.split('/').pop() || '';
		[this._name, this._extension = 'xml'] = this.fileName.split('.');
		this.xmlTag = this._getXmlTag();
		this.version = this._getVersionXml();
		this.encoding = this._getEncodingXml();
		this._children = XmlHelpers.getChildrenTags(this);
	}

	// ANCHOR - Methods
	private _getXmlTag(): string | null {
		const xmlTagPattern = /<\?xml.*\?>/;
		const xmlTag = this._content.match(xmlTagPattern)?.[0] ?? null;
		return xmlTag;
	}

	private _getVersionXml(): string {
		const versionPattern = /version\s*=\s*"(.*?)"/;
		const version = this.xmlTag?.match(versionPattern)?.[1] ?? '1.0';
		return version;
	}

	private _getEncodingXml(): string | null {
		const encodingPattern = /encoding\s*=\s*"(.*?)"/;
		const encoding = this.xmlTag?.match(encodingPattern)?.[1] ?? 'utf-8';
		return encoding;
	}

	public toJson(): {
		initType: string;
		xml: { version: string; encoding: string };
		file: { name: string; path: string; extension: string };
		tags: Record<string, any[]>;
	} {
		return XmlHelpers.xmlToJson(this) as {
			initType: string;
			xml: { version: string; encoding: string };
			file: { name: string; path: string; extension: string };
			tags: Record<string, any[]>;
		};
	}

	public createXmlFile(data: { name: string; path?: string }): string {
		const { name, path } = data;
		return createFile({
			content: this.content,
			name,
			path,
			extension: 'xml',
		});
	}

	public createJsonFile(data: { name: string; path?: string }): string {
		const { name, path } = data;
		return createFile({
			content: JSON.stringify(this.toJson(), null, 2),
			name,
			path,
			extension: 'json',
		});
	}

	public update(data: { content: string }): void {
		const { content } = data;
		const newXmlFile = new XmlFile({ text: content });
		Object.assign(this, newXmlFile);
	}
}

class XmlChild {
	public readonly id: number;
	public readonly name: string;
	public readonly content: string | null;
	public readonly children: XmlChild[] | null = null;
	public readonly parent: XmlFile | XmlChild | null = null;
	public readonly level;
	public readonly openTag: string;
	public readonly closeTag: string | null = null;
	public readonly isSelfClosing: boolean;
	public readonly attributes: Record<string, any> | null = null;
	public readonly isLastTag: boolean;

	constructor(props: {
		tag: string;
		content: string;
		parent?: XmlFile | XmlChild;
		id: number;
		level?: number;
	}) {
		let { tag, content, parent, level = 0, id } = props;
		this.id = id;
		content = content.trim().replace(patternCommentsXml, ''); // Remove comments
		this.name = tag.split(' ')[0];
		this.attributes = this._getAttributes(tag);
		this.isSelfClosing = content.endsWith('/>');
		
		this.openTag = this.isSelfClosing ? content : `<${tag}>`;
		this.closeTag = this.isSelfClosing ? null : `</${this.name}>`;
		this.parent = parent ?? null;
		this.content = this.isSelfClosing
		? null
			: content.replaceAll(/></g, '>\r\n<');
			this.level = level;
			
			if (
				!this.isSelfClosing &&
				content.includes('<') &&
				content.trim().length > 0
				) {
					this.children = XmlHelpers.getChildrenTags(this);
				}
				this.isLastTag = !this.children || this.children.length === 0;
				console.log(this);
	}

	// ANCHOR - Methods
	private _getAttributes(
		nameAndAtributesTag: string
	): Record<string, any> | null {
		const regex = /\b(\w+)\s*=\s*(?:"([^"]*)"|(\d+)|(true|false))\s*/g;
		let attributes: Record<string, any> = {};
		let match;
		while ((match = regex.exec(nameAndAtributesTag)) !== null) {
			const propertyName = match[1];
			const value =
				match[2] !== undefined
					? match[2]
					: match[3] !== undefined
					? parseInt(match[3])
					: match[4] !== undefined
					? match[4] === 'true'
					: undefined;
			attributes[propertyName] = value;
		}
		return Object.keys(attributes).length === 0 ? null : attributes;
	}

	public toJson(): Record<string, any> {
		return XmlHelpers.xmlToJson(this);
	}

	public getCompleteContent(): string {
		let content = this.openTag;
		if (this.isSelfClosing) return content;
		if (this.children) {
			for (const child of this.children) {
				content += child.getCompleteContent();
			}
		} else {
			content += this.content ?? '';
		}
		content += this.closeTag ?? '';
		return content;
	}

	// TODO
	// public update(data: { content: string }): void {
	// 	const { content } = data;
	// 	this.parent?.
		
	// }

	// public updateChild = (data: { id: number; content: string }): void => {
	// 	const { id, content } = data;
	// 	const child = this.children?.find((child) => child.id === id);
	// 	if (!child) return;
	// 	child.update({ content });
	// }
}

class XmlHelpers {
	// ANCHOR : Static Methods
	public static getChildrenTags(xmlItem: XmlFile | XmlChild): XmlChild[] {
		const { content, level } = xmlItem;
		if (!content) return [];
		const xmlTag = xmlItem instanceof XmlFile ? xmlItem.xmlTag : null;
		let text = content
			.replace(/[\n\r]/g, '')
			.replace(/>\s*</g, '><')
			.trim();
		if (xmlTag) text = text.replace(xmlTag, '');
		const tags: XmlChild[] = [];
		while (!!text) {
			const indexEnd = text.indexOf('>');
			if (indexEnd === -1) break;
			const openTag = text.slice(0, indexEnd + 1);
			if (openTag.includes('/>')) {
				tags.push(
					new XmlChild({
						tag: openTag.replace(/[<\/\>]/g, '')?.trim() ?? '',
						content: openTag,
						parent: xmlItem,
						level: level + 1,
						id: tags.length + 1,
					})
				);
				text = text.slice(indexEnd + 1);
			} else {
				const nameAndAtributesTag =
					openTag.replace(/[<\/\>]/g, '')?.trim() ?? '';
				const nameTag = nameAndAtributesTag.split(' ')[0];

				let textSearching = text.slice(indexEnd + 1);
				let textForTag = textSearching;
				let accCloseSomeTag = 0;
				while (true) {
					const openSameTag = textSearching.indexOf('<' + nameTag);
					const closeSameTag = textSearching.indexOf(
						'</' + nameTag + '>'
					);
					if (openSameTag !== -1 && openSameTag < closeSameTag) {
						accCloseSomeTag += closeSameTag + 1;
						textSearching = textSearching.slice(closeSameTag + 1);
					} else {
						const textTag = textForTag.slice(
							0,
							accCloseSomeTag + closeSameTag
						);
						textSearching = textSearching.slice(closeSameTag + 1);
						const lastTagIndex = textSearching.indexOf('>');
						text = textSearching.slice(lastTagIndex + 1);

						const xmlChild = new XmlChild({
							tag: nameAndAtributesTag,
							content: textTag,
							parent: xmlItem,
							level: level + 1,
							id: tags.length + 1,
						});
						tags.push(xmlChild);
						break;
					}
				}
			}
		}
		return tags;
	}

	public static xmlToJson = (
		xml: XmlChild | XmlFile
	): Record<string, any> => {
		const { children, content } = xml;
		const attributes = xml instanceof XmlChild ? xml.attributes : undefined;
		const json: Record<string, any> = {};
		if (xml instanceof XmlFile) {
			json['initType'] = xml.type;
			json['xml'] = {
				version: xml.version,
				encoding: xml.encoding,
			};
			json['file'] = {
				name: xml.fileName,
				path: xml.src,
				extension: xml.extension,
			};
		} else {
			json['isLastTag'] = xml.isLastTag;
		}
		if (attributes) json['attributes'] = attributes;
		if (children) {
			if (xml instanceof XmlFile) {
				json['tags'] = {};
			}
			for (const child of children) {
				if (xml instanceof XmlFile) {
					json['tags'][child.name] = [
						...(json['tags'][child.name] ?? []),
						XmlHelpers.xmlToJson(child),
					];
				} else {
					json[child.name] = [
						...(json[child.name] ?? []),
						XmlHelpers.xmlToJson(child),
					];
				}
			}
		} else {
			if (xml instanceof XmlChild) {
				xml.isSelfClosing || !content
					? undefined
					: (json['content'] = content);
				json['isSelfClosing'] = xml.isSelfClosing;
			}
		}
		return { ...json };
	};
}
