import * as helpers from './helpers/helpers';
import { JsonFile } from './models/json.model';
import { XmlFile } from './models/xml.model';

// const xmlFile = helpers.getFileText('./src/examples/example01.xml')
const xmlFile = new XmlFile({ src: './examples/example01.xml' });
// const jsonFile = new JsonFile({ src: './src/examples/example01.json' });
// console.log((jsonFile.content));
// const xmlFile2 = new XmlFile({
// 	text:
//     `<book>
//     <title name="segunda guerra mundial">Malditos bastardos</title>
//     <author>Tarantingo</author>
//     <genre>Violencia</genre>
//     <price>29.99</price>
//     <book>
//       <title name="anillos">El Señor de los Anillos</title>
//       <author>Pepote</author>
//       <genre>Fantasía</genre>
//       <price>299.99</price>
//     </book>
//   </book>`
// });

// console.log(xmlFile2.children?.[0]?.children?.[4]);
// console.log(xmlFile2.children?.[0]);
// xmlFile.isXmlFile();
console.log(xmlFile);
// console.log(xmlFile.content);
xmlFile.update({ content: '<pepe posi="es algo mas">El resto tambien?</pepe><code algo="pozi"/>' });
console.log(xmlFile.children[1].getCompleteContent());
// console.log(xmlFile);
// console.log(xmlFile.createXmlFile({ name:'algo'}));
// console.log(xmlFile.createJsonFile({ name:'algo'}));

// console.log(xmlFile.toJson().tags.library[0].book[0]);
// console.log(xmlFile.toJson().tags.library[0].book[0]);
