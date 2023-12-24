export { getFileText } from './files-helpers';

// Remove comments from files
export const patternCommentsJson = /(\/\*[\S\s]*?\*\/)|(\/\/[^\n]*)/g;
export const patternCommentsXml = /<!--[\s\S]*?-->/g;
