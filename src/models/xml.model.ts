import { getFileText } from '../helpers/read-file';
import { FileType } from '../interfaces/basic.interface';

export class XmlFile {
	// ANCHOR - Properties
	public readonly name: string;
	public readonly fileName: string;
	public readonly content: string;
	public readonly url: string;
	public readonly extension: string;
	public readonly type: FileType = 'xml';
	public readonly version: string;
	public readonly xmlTag: string | null = null;
	public readonly encoding;

	// ANCHOR - Constructor
	constructor(url: string) {
		this.url = url;
		this.content = getFileText(url);
		this.fileName = url.split('/').pop() || '';
		[this.name, this.extension] = this.fileName.split('.');
		this.xmlTag = this._getXmlTag();
		this.version = this._getVersionXml();
		this.encoding = this._getEncodingXml();

		// // Expresión regular para encontrar los bloques XML
		// let regex = /<[^>]*>[^<]*<\/[^>]*>|<[^\/>]*\/>/g;
		// let matches = this.content.match(regex);

		// Muestra los resultados
		// console.log(matches);
		console.log(this);
	}

	// ANCHOR - Methods
	private _createTags() {}

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
}
