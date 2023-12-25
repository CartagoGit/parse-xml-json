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
	const { extension, name, content, path = '_generated' } = data;
	const fileName = `${name}.${extension}`;
	const fullPath = `${path}/${fileName}`;

	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
		console.log(`Directory '${path}' created`);
	  }

	if (fs.existsSync(fullPath)) {
		console.error(`Error: File '${fullPath}' already exists`);
		return fullPath;
	}
	fs.writeFileSync(fullPath, content);
	return fullPath;
};
