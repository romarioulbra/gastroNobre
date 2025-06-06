// // src/app/api/gerar-comprovante/route.ts
// import { NextResponse } from 'next/server';
// import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

// const lambdaClient = new LambdaClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
//   }
// });

// export async function POST(request: Request) {
//   try {
//     const { id } = await request.json();
    
//     if (!id) {
//       return NextResponse.json(
//         { error: 'ID do pedido é obrigatório' },
//         { status: 400 }
//       );
//     }

//     // 1. Busca o pedido na sua própria API
//     const pedidoResponse = await fetch(`http://localhost:3000/api/pedidos/${id}`, {
//       cache: 'no-store'
//     });
    
//     if (!pedidoResponse.ok) {
//       const error = await pedidoResponse.json();
//       return NextResponse.json(
//         { error: error.message || 'Erro ao buscar pedido' },
//         { status: pedidoResponse.status }
//       );
//     }

//     const pedido = await pedidoResponse.json();

//     // 2. Chama a Lambda (seu código existente)
//     const command = new InvokeCommand({
//       FunctionName: process.env.LAMBDA_GERAR_COMPROVANTE!,
//       InvocationType: 'RequestResponse',
//       Payload: Buffer.from(JSON.stringify({
//         id: pedido.id,
//         cliente: pedido.cliente,
//         mesa: pedido.mesa,
//         itens: pedido.itens // Ajuste conforme sua estrutura
//       }))
//     });

//     const lambdaResponse = await lambdaClient.send(command);
    
//         // 3. Processamento seguro da resposta
//     if (lambdaResponse.FunctionError) {
//       return NextResponse.json(
//         { message: `Erro na Lambda: ${lambdaResponse.FunctionError}` },
//         { status: 500 }
//       );
//     }

//     // Converter o Payload (que pode ser Uint8Array) para string
//     const payloadStr = lambdaResponse.Payload 
//       ? new TextDecoder().decode(lambdaResponse.Payload)
//       : '{}';
    
//     const payload = JSON.parse(payloadStr);
//     // Algumas Lambdas retornam o corpo direto, outras encapsulam em 'body'
//     const result = payload.body ? JSON.parse(payload.body) : payload;

//     if (!result.pdfBase64) {
//       return NextResponse.json(
//         { message: 'Resposta da Lambda sem pdfBase64' },
//         { status: 500 }
//       );
//     }

//     // 4. Retorna o PDF corretamente
//     const pdfBuffer = Buffer.from(result.pdfBase64, 'base64');
    
//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: new Headers({
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename=comprovante-${id}.pdf`
//       })
//     });

    
//   } catch (error) {
//     console.error('Erro completo:', error);
//     return NextResponse.json(
//       { error: 'Erro ao gerar comprovante' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/gerar-comprovante/route.ts
import { NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { dynamo } from '../../../lib/dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: "http://localhost:4566", // LocalStack
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      );
    }

    // 1. Busca o pedido no DynamoDB
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

    // 2. Chama a Lambda
    const lambdaCommand = new InvokeCommand({
      FunctionName: process.env.LAMBDA_GERAR_COMPROVANTE || "GerarComprovanteFunction",
      InvocationType: 'RequestResponse',
      Payload: Buffer.from(JSON.stringify({
        id: pedido.id,
        cliente: pedido.cliente,
        mesa: pedido.mesa,
        itens: pedido.itens // Ajuste conforme sua estrutura
      }))
    });

    const lambdaResponse = await lambdaClient.send(lambdaCommand);
    
    // 3. Processa resposta da Lambda
    if (lambdaResponse.FunctionError) {
      return NextResponse.json(
        { error: `Erro na Lambda: ${lambdaResponse.FunctionError}` },
        { status: 500 }
      );
    }

    const payloadStr = lambdaResponse.Payload 
      ? new TextDecoder().decode(lambdaResponse.Payload)
      : '{}';
    
    const result = JSON.parse(payloadStr);
    const pdfBase64 = result.body ? JSON.parse(result.body).pdfBase64 : result.pdfBase64;

    if (!pdfBase64) {
      return NextResponse.json(
        { error: 'Resposta da Lambda sem pdfBase64' },
        { status: 500 }
      );
    }

    // 4. Retorna o PDF
    return new NextResponse(Buffer.from(pdfBase64, 'base64'), {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=comprovante-${id}.pdf`
      })
    });

  } catch (error) {
    console.error('Erro completo:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar comprovante' },
      { status: 500 }
    );
  }
}