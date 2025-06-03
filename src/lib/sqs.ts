import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const client = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

export async function enviarParaFila(pedido: any) {
  const command = new SendMessageCommand({
    QueueUrl: "http://localhost:4566/000000000000/pedidos-cozinha",
    MessageBody: JSON.stringify(pedido)
  });

  await client.send(command);
}
