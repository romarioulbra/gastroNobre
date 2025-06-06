// src/app/api/pedidos/[id]/route.ts
import { NextResponse } from 'next/server';
// import { dynamo } from '@/lib/dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo } from '../../../../lib/dynamodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Busca no DynamoDB
    const command = new GetCommand({
      TableName: "Pedidos", // Substitua pelo nome real da sua tabela
      Key: { id }
    });

    const { Item: pedido } = await dynamo.send(command);

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);

  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar pedido' },
      { status: 500 }
    );
  }
}