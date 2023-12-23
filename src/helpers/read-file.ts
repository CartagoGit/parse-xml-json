import fs from 'fs';
import { FileEncodingType } from '../interfaces/basic.interface';

export const getFileText = (
	path: string,
	options: {
		encoding: FileEncodingType;
	}
): string => {
	const { encoding = 'utf8' } = options;
	const fileText = fs.readFileSync(path, encoding);
	console.log('fileText', fileText);
	return fileText;
};
