export type FileType = 'xml' | 'json';

export type FileEncodingType =
	| 'ascii'
	| 'base64'
	| 'base64url'
	| 'hex'
	| 'ucs2'
	| 'ucs-2'
	| 'utf16le'
	| 'utf-16le'
	| 'utf8'
	| 'utf-8'
	| 'binary'
	| 'latin1';

export interface FileProps<P, C> {
	name: string;
	fileName: string;
	content: string;
	src: string;
	extension: string;
	type: FileType;
	children: C[];
	parent?: P | C | null;
	level: number;
}
