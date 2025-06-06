// import { SQSHandler } from 'aws-lambda';
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import AWS from 'aws-sdk';

// const s3 = new AWS.S3();

// // Sua função adaptada para a Lambda
// async function gerarPdfPedido(id: string, cliente: string, mesa: number, itens: string[]): Promise<Buffer> {
//   const path = `/tmp/comprovante-${id}.pdf`;
//   const doc = new PDFDocument();

//   doc.pipe(fs.createWriteStream(path));
//   doc.fontSize(20).text("Comprovante de Pedido", { align: "center" });
//   doc.moveDown();
//   doc.fontSize(12).text(`ID do Pedido: ${id}`);
//   doc.text(`Cliente: ${cliente}`);
//   doc.text(`Mesa: ${mesa}`);
//   doc.moveDown();
//   doc.text("Itens:");
//   itens.forEach((item) => doc.text(`- ${item}`));
//   doc.moveDown();
//   doc.text(new Date().toLocaleString());
//   doc.end();

//   await new Promise((resolve) => doc.on("finish", resolve));
//   const file = fs.readFileSync(path);
//   fs.unlinkSync(path);

//   return file;
// }

// export const handler: SQSHandler = async (event) => {
//   try {
//     // Processar cada mensagem da fila SQS
//     for (const record of event.Records) {
//       const pedido = JSON.parse(record.body);
      
//       // Gerar o PDF usando sua função
//       const pdfBuffer = await gerarPdfPedido(
//         pedido.id,
//         pedido.cliente,
//         pedido.mesa,
//         pedido.itens
//       );

//       // Salvar no S3
//       const s3Params = {
//         Bucket: process.env.S3_BUCKET_NAME || 'seu-bucket-pedidos',
//         Key: `comprovantes/${pedido.id}.pdf`,
//         Body: pdfBuffer,
//         ContentType: 'application/pdf'
//       };

//       await s3.putObject(s3Params).promise();

//       console.log(`Comprovante para pedido ${pedido.id} salvo no S3`);
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Processamento concluído" })
//     };
//   } catch (error) {
//     console.error('Erro ao processar pedido:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ 
//         message: "Erro ao processar pedido",
//         error: error.message 
//       })
//     };
//   }
// };

import { Handler } from 'aws-lambda';
import PDFDocument from "pdfkit";
import fs from "fs";

export const handler: Handler = async (event) => {
  try {
    const { id, cliente, mesa, itens } = event;
    
    // Gera o PDF
    const pdfBuffer = await gerarPdfPedido(id, cliente, mesa, itens);
    
    return {
      statusCode: 200,
      body: {
        pdfBase64: pdfBuffer.toString('base64'),
        message: "Comprovante gerado com sucesso"
      }
    };
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: {
        message: 'Erro ao gerar comprovante',
        error: error.message
      }
    };
  }
};

async function gerarPdfPedido(id: string, cliente: string, mesa: number, itens: string[]): Promise<Buffer> {
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