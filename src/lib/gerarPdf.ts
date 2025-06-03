// import PDFDocument from "pdfkit";
// import { PassThrough } from "stream";

// export async function gerarPDFBuffer(pedido: {
//   id: string;
//   cliente: string;
//   mesa: number;
//   itens: string[];
// }): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     const buffer: Uint8Array[] = [];

//     doc.on("data", chunk => buffer.push(chunk));
//     doc.on("end", () => resolve(Buffer.concat(buffer)));
//     doc.on("error", reject);

//     doc.fontSize(20).text("Comprovante de Pedido", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(12).text(`ID do Pedido: ${pedido.id}`);
//     doc.text(`Cliente: ${pedido.cliente}`);
//     doc.text(`Mesa: ${pedido.mesa}`);
//     doc.text("Itens:");
//     pedido.itens.forEach((item, i) => {
//       doc.text(` - ${item}`);
//     });
//     doc.end();
//   });
// }

import PDFDocument from "pdfkit";
import fs from "fs";

export async function gerarPdfPedido(id: string, cliente: string, mesa: number, itens: string[]): Promise<Buffer> {
  const path = `/tmp/comprovante-${id}.pdf`;
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(path));
  doc.fontSize(20).text("Comprovante de Pedido", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`ID do Pedido: ${id}`);
  doc.text(`Cliente: ${cliente}`);
  doc.text(`Mesa: ${mesa}`);
  doc.moveDown();
  doc.text("Itens:");
  itens.forEach((item) => doc.text(`- ${item}`));
  doc.moveDown();
  doc.text(new Date().toLocaleString());
  doc.end();

  await new Promise((resolve) => doc.on("finish", resolve));
  const file = fs.readFileSync(path);
  fs.unlinkSync(path);

  return file;
}
