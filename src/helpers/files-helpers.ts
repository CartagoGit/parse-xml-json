import fs from 'fs';

import { FileEncodingType, FileType } from '../interfaces/basic.interface';

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

export const createFile = (data: {
	content: string;
	path?: string;
	name?: string;
	extension?: FileType;
}): string => {
	const { extension, name, content, path = 'src/examples/' } = data;
	const fileName = `${name}.${extension}`;
	const fullPath = `${path}/${fileName}`;
	fs.writeFileSync(fullPath, content);
	return `File created at ${fullPath}`;
};
