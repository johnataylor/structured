
import fs from 'fs';
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import Canvas from "canvas";
import { strict as assert } from "assert";

// Some PDFs need external cmaps.
const CMAP_URL = "node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;

// Where the standard fonts are located.
const STANDARD_FONT_DATA_URL = "node_modules/pdfjs-dist/standard_fonts/";

class NodeCanvasFactory {
  create(width, height) {
    assert(width > 0 && height > 0, "Invalid canvas size");
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, "Canvas is not specified");
    assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, "Canvas is not specified");

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

const canvasFactory = new NodeCanvasFactory();

export async function loadPdfDocument(path) {

  console.log(`loadPdfDocument('${path}')`);

  const data = new Uint8Array(fs.readFileSync(path));

  const loadingTask = getDocument({
    data,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
    canvasFactory,
  });

  const pdfDocument = await loadingTask.promise;

  return pdfDocument;
}

export async function createPngFromPageOfPdf(pdfDocument, pageNumber, fileName) {

  console.log(`createPngFromPageOfPdf(pdfDocument, ${pageNumber}, '${fileName}')`);

  const page = await pdfDocument.getPage(pageNumber);

  // Render the page on a Node canvas with 100% scale.
  const viewport = page.getViewport({ scale: 1.0 });
  const canvasAndContext = canvasFactory.create(
    viewport.width,
    viewport.height
  );
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
  };

  const renderTask = page.render(renderContext);
  await renderTask.promise;
 
  // Convert the canvas to an image buffer.
  const image = canvasAndContext.canvas.toBuffer();

  await fs.writeFileSync(fileName, image);

  // Release page resources.
  page.cleanup();
}

export async function createTextFromPageOfPdf(pdfDocument, pageNumber, fileName) {

  console.log(`createTextFromPageOfPdf(pdfDocument, ${pageNumber}, '${fileName}')`);

  const page = await pdfDocument.getPage(pageNumber);

  const pageText = await page.getTextContent();
  let text = pageText.items.map(item => item.str).join(' ');
  await fs.writeFileSync(fileName, text);

  //const pageText = page.pageText

  // page.getTextContent().then(function(textContent) {
  //   let text = textContent.items.map(item => item.str).join(' ');
  //   console.log(text);
  // });

  //await fs.writeFileSync(fileName, pageText);

  // Release page resources.
  page.cleanup();
}
