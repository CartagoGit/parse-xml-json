import { getFileText } from '../helpers/read-file';
import { FileType } from '../interfaces/basic.interface';

export class XmlFile {
	// ANCHOR - Properties
	public readonly name: string;
	public readonly fileName: string;
	public readonly fileText: string;
	public readonly url: string;
	public readonly type: FileType = 'xml';
	public readonly version: string;

	private readonly _initTags = ['<?', '<!', '<'];
	private readonly _endTags = ['?>', '>'];

	// ANCHOR - Constructor
	constructor(url: string) {
		this.url = url;
		this.fileText = getFileText(url);
		this.fileName = url.split('/').pop() || '';
		this.name = this.fileName.split('.').shift() || '';

		// TODO: get version from xml file
		this.version = '1.0';
	}

	// ANCHOR - Methods
	public isXmlFile(): boolean {
		try {
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(
				this.fileText,
				'application/xml'
			);
			// Si no hay errores al parsear, entonces el archivo tiene un formato XML válido
			console.log('El archivo tiene un formato XML válido.');
			console.log(xmlDoc);
			return true;
		} catch (error) {
			console.error(
				'El archivo no tiene un formato XML válido:',
				error.message
			);
			return false;
		}
	}
}
