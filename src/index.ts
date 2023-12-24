import * as helpers from './helpers/helpers';
import { XmlFile } from './models/xml.model';

// const xmlFile = helpers.getFileText('./src/examples/example01.xml')
// const xmlFile = new XmlFile({ src: './src/examples/example01.xml' });

const xmlFile2 = new XmlFile({
	text:
    `<book>
    <title name="anillos">El Señor de los Anillos</title>
    <author>J.R.R. Tolkien</author>
    <genre>Fantasía</genre>
    <price>29.99</price>
    <book>
      <title name="anillos">El Señor de los Anillos</title>
      <author>Pepote
      </author>
      <genre>Fantasía</genre>
      <price>299.99</price>
    </book>
    </book>`
});

// xmlFile.isXmlFile();
// console.log(xmlFile);
