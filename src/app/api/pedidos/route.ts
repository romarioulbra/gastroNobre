import { NextRequest, NextResponse } from "next/server";
import { 
  DynamoDBClient, 
  PutItemCommand, 
  ScanCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand 
} from "@aws-sdk/client-dynamodb";

import { SQSClient, SendMessageCommand, CreateQueueCommand,PurgeQueueCommand } from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamo = new DynamoDBClient({
  region: "us-east-1",
   endpoint: process.env.DYNAMODB_ENDPOINT|| "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
  // forcePathStyle: true,
});

const sqs = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const QUEUE_URL = "http://localhost:4566/000000000000/pedidos";
const TABLE_NAME = "pedidos";

// Função para criar a fila e tabela se não existirem
async function initializeResources() {
  try {
    // Cria a fila SQS
    await sqs.send(new CreateQueueCommand({
      QueueName: "pedidos"
    }));
    console.log("Fila 'pedidos' verificada/criada");

    // Verifica/Cria a tabela no DynamoDB
    try {
      await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
      console.log(`Tabela ${TABLE_NAME} já existe`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`Tabela ${TABLE_NAME} não encontrada, criando...`);
        // Em LocalStack, a tabela é criada automaticamente no primeiro uso
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar recursos:", error);
  }
}

// Inicializa os recursos quando o módulo é carregado
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

    // Salva no DynamoDB
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

    // Envia para a fila SQS
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
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await dynamo.send(command);
    
    // Converte os itens do formato DynamoDB para objeto JavaScript
    const pedidos = response.Items?.map(item => unmarshall(item)) || [];

    return NextResponse.json(pedidos);

  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    
    // Se a tabela não existir, retorna array vazio (para LocalStack)
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
    console.log('Iniciando exclusão de pedido');
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log('ID recebido:', id);

    if (!id) {
      console.log('ID não fornecido');
      return NextResponse.json(
        { error: "ID do pedido é obrigatório" },
        { status: 400 }
      );
    }

    // Remove o pedido do DynamoDB diretamente
    // O DeleteItemCommand já verifica se o item existe
    const deleteCommand = new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: { id: { S: id } },
      ReturnValues: 'ALL_OLD' // Retorna o item deletado
    });

    console.log('Enviando comando para DynamoDB');
    const result = await dynamo.send(deleteCommand);
    
    if (!result.Attributes) {
      console.log('Pedido não encontrado para exclusão');
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    console.log('Pedido excluído com sucesso:', result.Attributes);
    
    // Limpeza opcional da fila SQS (remova se não for necessário)
    try {
      console.log('Tentando purgar fila SQS');
      await sqs.send(new PurgeQueueCommand({
        QueueUrl: QUEUE_URL
      }));
      console.log('Fila SQS purgada com sucesso');
    } catch (sqsError) {
      console.error("Erro ao purgar fila SQS (não crítico):", sqsError);
      // Não falha a operação principal por isso
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
    console.error("Erro completo ao excluir pedido:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
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

    // Primeiro verifica se o pedido existe
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

    // Atualiza o status do pedido
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

    // Envia notificação para a fila SQS sobre a atualização
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