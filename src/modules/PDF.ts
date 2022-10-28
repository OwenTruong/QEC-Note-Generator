// TODO: Get the basic implementations down and then refactor it into a prototype class.

// import * as R from "ramda";
import { 
  PDFDocument,
  PDFPage,
} from 'pdf-lib';



import { OpaqueEnv } from "@/classes/OpaqueEnv";

// import { TemplateT } from "@/types/TemplateT";
// import { LineT } from "@/types/LineT";
// import { ImageT } from "@/types/ImageT";

// import { integrityCheck } from "@/functions/integrityCheck";

import { TemplateC } from "@/classes/TemplateC";
import { PageC } from "@/classes/PageC";
import { LineC } from "@/classes/LineC";
import { ImageC } from "@/classes/ImageC";




// Pretty useless class, one use disposable...
export class PDF {
  #pdfDoc!: PDFDocument;
  #template!: TemplateC;
  #pdfBytes: Uint8Array | null = null;
  #created = false;

  async init(template: any): Promise<void> {
    this.#pdfDoc = await PDFDocument.create();
    this.#template = new TemplateC(template);
    this.#pdfBytes = null;
    this.#created = false;
  }

  async #save(): Promise<void> {
    if (!this.#pdfDoc) throw new Error('Need to call init first');
    this.#pdfBytes = await this.#pdfDoc.save();
  }

  async writePDF(path: string): Promise<void> {
    await this.#save();
    if (!this.#pdfBytes) throw new Error('Need to call init first');
    OpaqueEnv.writeFile('./test.pdf', this.#pdfBytes);
  }

  // Embed a certain amount of images to a page given a template for a page
  async #embedImgsToPage(page: PDFPage, imgTmps: ImageC[], filePaths: string[]): Promise<void> {
    if (imgTmps.length < filePaths.length) return console.error('Too many images for a page.');

    for (let i = 0; i < filePaths.length; ++i) {
      await imgTmps[i].drawImage(this.#pdfDoc, page, filePaths[i]);
    }
  }

  // async #embedLinesToPage(page: PDFPage, lineTmps: LineT[]): Promise<void> {

  // }






  async createPDF(dstPath: string, imgsPath: string): Promise<void> {
    // TODO: First images, then lines, then date and page #

    // Error Checking
    if (!this.#pdfDoc) 
      return console.error('Need to call init first before creating pdf');
    if (this.#created == true) 
      return console.error('PDF created already. To create a new one, please call init() before creating pdf');

    // TODO FUTURE: How are we even going to get file paths and if there are file paths in browser implementation...
    const filePaths: string[] = OpaqueEnv.getFilePaths(imgsPath)(['png', 'jpg']);
    const pagesTemp: PageC[]  = this.#template.pages;



    let pnum: number = 0;
    while (filePaths.length != 0) {
      // pageTemplate -> If template = 2, page 1, 3, 5 and etc follow temp1 and page 2, 4, 6 and etc follow temp2
      const pageTemp: PageC = pagesTemp[pnum % pagesTemp.length];
      const page = this.#pdfDoc.addPage();


      // Add Image to PDF
      const imgTmps: ImageC[] = pageTemp.images;
      await this.#embedImgsToPage(page, imgTmps,
        filePaths.splice( 0, Math.min( filePaths.length, imgTmps.length ) )
      );

      // TODO: Add lines to template and do what you need to do here too
      // const lineTmps: LineT[] = pageTemp.lines;

      

      pnum++;
    }

    this.#created = true;
  }


}