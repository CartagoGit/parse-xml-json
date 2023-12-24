import fs from 'fs';
import { FileEncodingType, FileType } from '../interfaces/basic.interface';
import { XmlFile } from '../models/xml.model';
import { JsonFile } from '../models/json.model';

export const getFileText = (
	path: string,
	options?: {
		encoding?: FileEncodingType;
	}
): string => {
	let { encoding = 'utf8' } = options || {};
	encoding = encoding.toLowerCase() as FileEncodingType;
	return fs.readFileSync(path, encoding);
};

export const createFile = (
	file: XmlFile | JsonFile,
	options?: { name?: string; extension?: FileType }
): void => {
	let { extension, name, content } = file;
	if (options) {
		extension = options.extension ?? extension;
		name = options.name ?? name;
	}

	const fileName = `${name}.${extension}`;
	fs.writeFileSync(fileName, content);
};
