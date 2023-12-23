import fs from 'fs';
import { FileEncodingType } from '../interfaces/basic.interface';

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
