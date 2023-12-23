import fs from 'fs';
import { FileEncodingType } from '../interfaces/basic.interface';

export const getFileText = (
	path: string,
	options?: {
		encoding?: FileEncodingType;
	}
): string => {
	const { encoding = 'utf8' } = options || {};
	return fs.readFileSync(path, encoding);
};
