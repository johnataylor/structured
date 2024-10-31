
import { loadPdfDocument, createPngFromPageOfPdf, createTextFromPageOfPdf } from './pdfProcessing.js';

const fullPathToPdf = 'c:\\data\\leica\\pm-111411-Leica-D-Lux8_Instructions_en_1.0.pdf';
const pathForFiles = 'c:\\data\\leica\\pages';

const pdfDocument = await loadPdfDocument(fullPathToPdf);

const beginPageNumber = 1;
const endPageNumber = pdfDocument.numPages;

// for (let pageNumber=beginPageNumber; pageNumber<endPageNumber; pageNumber++) {

//   const fileName = `page${pageNumber}`;
//   const fullPathToPng = `${pathForFiles}\\${fileName}.png`;

//   await createPngFromPageOfPdf(pdfDocument, pageNumber, fullPathToPng);
// }

for (let pageNumber=beginPageNumber; pageNumber<endPageNumber; pageNumber++) {

  const fileName = `page${pageNumber}`;
  const fullPathToPng = `${pathForFiles}\\${fileName}.txt`;

  await createTextFromPageOfPdf(pdfDocument, pageNumber, fullPathToPng);
}
