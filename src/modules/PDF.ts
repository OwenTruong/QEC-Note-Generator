// TODO: Get the basic implementations down and then refactor it into a prototype class.

// import * as R from "ramda";
import { 
  PDFDocument,
  PDFImage,
  PDFPage,
  StandardFonts 
} from 'pdf-lib';

import fs from 'fs';


import { ImageC } from './classes/ImageC';
import { ImageT } from './types/ImageT';
import { findFiles } from './functions/findFiles';

import { d3_print_portrait } from './defaults';



// TODO: We are finally there... how should we create our PDF class?
export async function pdftest(): Promise<void> {
  const pdf = new PDF();
  // Get PDF Document
  const pdfDoc: PDFDocument = await PDFDocument.create();
  const page: PDFPage = pdfDoc.addPage();

  // Add Images to PDF
  const images: ImageT[] = d3_print_portrait.images.type1;
  const paths: string[] = findFiles('.')(['png', 'jpg']);
  await ImageC.drawImages(pdfDoc, page, images, paths);

  // Speed of saving is a concern
  const pdfBytes: Uint8Array = await pdfDoc.save();

  // Write PDF to test.pdf
  fs.writeFileSync('./test.pdf', pdfBytes);

}


class PDF {
  pdfDoc!: PDFDocument;
  pdfBytes!: Uint8Array;

  async init() {
    this.pdfDoc = await PDFDocument.create();
  }

  async save() {
    if (!this.pdfDoc) console.error('Need to call init()');
    this.pdfBytes = await this.pdfDoc.save();
  }

  writeFile(path: string) {
    if (!this.pdfBytes) console.error('Unable save uninitialized pdf bytes');
    fs.writeFileSync(path, this.pdfBytes);
  }
}