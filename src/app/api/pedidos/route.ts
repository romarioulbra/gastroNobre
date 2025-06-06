import { NextRequest, NextResponse } from "next/server";
import { 
  DynamoDBClient, 
  PutItemCommand, 
  ScanCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand 
} from "@aws-sdk/client-dynamodb";

import { 
  SQSClient, 
  SendMessageCommand, 
  CreateQueueCommand,
  PurgeQueueCommand 
} from "@aws-sdk/client-sqs";

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

import { randomUUID } from "crypto";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({
  region: "us-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const sqs = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const sns = new SNSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const QUEUE_URL = "http://localhost:4566/000000000000/pedidos";
const TABLE_NAME = "pedidos";
const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:000000000000:PedidosConcluidos";

async function notificarPedidoConcluido(id: string) {
  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Message: `Novo pedido concluído: ${id}`,
    Subject: "Pedido Pronto!"
  });

  await sns.send(command);
}

async function initializeResources() {
  try {
    await sqs.send(new CreateQueueCommand({
      QueueName: "pedidos"
    }));
    console.log("Fila 'pedidos' verificada/criada");

    try {
      await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
      console.log(`Tabela ${TABLE_NAME} já existe`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`Tabela ${TABLE_NAME} não encontrada, criando...`);
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar recursos:", error);
  }
}

initializeResources();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cliente, itens, mesa } = body;

    if (!cliente || !Array.isArray(itens) || typeof mesa !== "number") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();

    const putCommand = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        cliente: { S: cliente },
        mesa: { N: mesa.toString() },
        status: { S: "pendente" },
        itens: { L: itens.map((i: string) => ({ S: i })) },
        createdAt: { S: createdAt }
      },
    });

    await dynamo.send(putCommand);

    const sqsCommand = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({ 
        id,
        action: "process_pedido",
        createdAt
      }),
      MessageAttributes: {
        Tipo: {
          DataType: "String",
          StringValue: "Pedido"
        }
      }
    });

    await sqs.send(sqsCommand);

    return NextResponse.json({ 
      message: "Pedido criado com sucesso", 
      id,
      mesa,
      cliente,
      itens, 
      status: "pendente",
      createdAt
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ 
      error: "Erro interno no servidor",
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await dynamo.send(command);
    const pedidos = response.Items?.map(item => unmarshall(item)) || [];
    return NextResponse.json(pedidos);

  } catch (error) {
    console.error("Erro ao listar pedidos:", error);

    if (error.name === 'ResourceNotFoundException') {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json({ 
      error: "Erro ao buscar pedidos",
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID do pedido é obrigatório" },
        { status: 400 }
      );
    }

    const deleteCommand = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
      ReturnValues: 'ALL_OLD'
    });

    const result = await dynamo.send(deleteCommand);

    if (!result.Attributes) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    try {
      await sqs.send(new PurgeQueueCommand({ QueueUrl: QUEUE_URL }));
    } catch (sqsError) {
      console.error("Erro ao purgar fila SQS (não crítico):", sqsError);
    }

    return NextResponse.json(
      { 
        message: "Pedido excluído com sucesso", 
        id,
        deletedItem: unmarshall(result.Attributes)
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro completo ao excluir pedido:", error);
    return NextResponse.json(
      { 
        error: "Erro interno ao excluir pedido",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID e status são obrigatórios" },
        { status: 400 }
      );
    }

    const getCommand = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } }
    });

    const existingItem = await dynamo.send(getCommand);

    if (!existingItem.Item) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    const updateCommand = new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": { S: status }
      },
      ReturnValues: "ALL_NEW"
    });

    const result = await dynamo.send(updateCommand);
    const updatedItem = unmarshall(result.Attributes || {});

    if (status === "concluido") {
      try {
        await notificarPedidoConcluido(id);
        console.log(`Notificação SNS enviada para pedido ${id}`);
      } catch (snsError) {
        console.error("Erro ao enviar notificação SNS:", snsError);
      }
    }

    const sqsCommand = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify({
        id,
        action: "status_updated",
        newStatus: status,
        updatedAt: new Date().toISOString()
      })
    });

    await sqs.send(sqsCommand);

    return NextResponse.json({
      message: "Status do pedido atualizado com sucesso",
      pedido: updatedItem
    });

  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return NextResponse.json(
      { 
        error: "Erro interno ao atualizar status",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
