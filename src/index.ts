import * as helpers from './helpers/helpers';
import { XmlFile } from './models/xml.model';


// const xmlFile = helpers.getFileText('./src/examples/example01.xml')
const xmlFile = new XmlFile('./src/examples/example01.xml');
// xmlFile.isXmlFile();
console.log(xmlFile);