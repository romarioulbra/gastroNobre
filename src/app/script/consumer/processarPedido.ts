import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import PDFDocument from "pdfkit";
import fs from "fs";
import { dynamo } from "./dynamodb"; // Importa o client configurado

const sqs = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
});

const QUEUE_URL = "http://localhost:4566/000000000000/pedidos";
const BUCKET_NAME = "comprovantes-pedidos";

// Função para verificar/criar o bucket S3
async function createBucketIfNotExists() {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'test-file.txt',
      Body: 'test'
    }));
    console.log(`Bucket ${BUCKET_NAME} verificado/criado`);
  } catch (error) {
    console.error(`Erro ao verificar/criar bucket ${BUCKET_NAME}:`, error);
  }
}

// Cria o bucket ao iniciar
createBucketIfNotExists();

async function gerarComprovante(id: string, cliente: string, mesa: number, itens: string[]) {
  const doc = new PDFDocument();
  const path = `/tmp/comprovante-${id}.pdf`;
  
  doc.pipe(fs.createWriteStream(path));
  doc.fontSize(20).text("Comprovante de Pedido", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`ID do Pedido: ${id}`);
  doc.text(`Cliente: ${cliente}`);
  doc.text(`Mesa: ${mesa}`);
  doc.moveDown();
  doc.text("Itens:");
  itens.forEach(item => doc.text(`- ${item}`));
  doc.moveDown();
  doc.text(new Date().toLocaleString());
  doc.end();

  await new Promise((resolve) => doc.on("finish", resolve));

  const file = fs.readFileSync(path);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `comprovante-${id}.pdf`,
      Body: file,
      ContentType: "application/pdf",
    })
  );

  fs.unlinkSync(path);
  return `http://localhost:4566/${BUCKET_NAME}/comprovante-${id}.pdf`;
}

async function processarPedidos() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 10,
      MessageAttributeNames: ["All"],
    });

    const response = await sqs.send(command);
    if (!response.Messages || response.Messages.length === 0) {
      console.log("Nenhuma mensagem na fila.");
      return;
    }

    for (const message of response.Messages) {
      try {
        const { id } = JSON.parse(message.Body!);
        console.log(`Processando pedido ${id}...`);

        // Obtém o pedido do DynamoDB usando o Document Client
        const { Item: pedido } = await dynamo.send(
          new GetCommand({
            TableName: "pedidos",
            Key: { id },
          })
        );

        if (!pedido) {
          console.error(`Pedido ${id} não encontrado no banco de dados`);
          continue;
        }

        // Gera o comprovante
        const comprovanteUrl = await gerarComprovante(
          pedido.id,
          pedido.cliente,
          pedido.mesa,
          pedido.itens
        );

        // Atualiza o pedido no DynamoDB
        await dynamo.send(
          new UpdateCommand({
            TableName: "pedidos",
            Key: { id },
            UpdateExpression: "SET #s = :s, comprovanteUrl = :url, processedAt = :now",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: {
              ":s": "processado",
              ":url": comprovanteUrl,
              ":now": new Date().toISOString(),
            },
          })
        );

        // Remove a mensagem da fila
        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle!,
          })
        );

        console.log(`Pedido ${id} processado com sucesso. Comprovante: ${comprovanteUrl}`);
      } catch (error) {
        console.error(`Erro ao processar mensagem:`, error);
      }
    }
  } catch (error) {
    console.error("Erro no processador de pedidos:", error);
  }
}

// Configura o intervalo de processamento
const INTERVALO_PROCESSAMENTO = 5000; // 5 segundos
setInterval(processarPedidos, INTERVALO_PROCESSAMENTO);
console.log(`Processador de pedidos iniciado. Verificando a cada ${INTERVALO_PROCESSAMENTO/1000} segundos...`);

// Processa imediatamente ao iniciar
processarPedidos();