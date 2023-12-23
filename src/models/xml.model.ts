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

	private readonly _initTags = ['<?', '<!', '<'];
	private readonly _endTags = ['?>', '>'];

	// ANCHOR - Constructor
	constructor(url: string) {
		this.url = url;
		this.content = getFileText(url);
		this.fileName = url.split('/').pop() || '';
		[this.name, this.extension] = this.fileName.split('.');

		// TODO: get version from xml file
		this.version = '1.0';

        // Expresión regular para encontrar los bloques XML
const regex = /<[^>]+>[^<]*<\/[^>]+>|<[^>]+\/>/g;

// Encuentra todas las coincidencias en el string XML
const matches = this.content.match(regex);

// Muestra los resultados
console.log(matches);
	}

	// ANCHOR - Methods
    private _createTags = () => {

    }
}
