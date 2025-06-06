// lib/sns.ts
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

export const sns = new SNSClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

export const publishPedidoConcluido = async (pedidoId: string) => {
  const message = `Novo pedido concluído: ${pedidoId}`

  const command = new PublishCommand({
    TopicArn: 'arn:aws:sns:us-east-1:000000000000:PedidosConcluidos',
    Message: message,
    Subject: 'Pedido Pronto!',
  })

  await sns.send(command)
}
