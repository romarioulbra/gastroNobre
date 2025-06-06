// app/api/sns-events/route.ts
import { NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({
  region: "us-east-1",
  endpoint: "http://localhost:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test"
  }
});

const TOPIC_ARN = "arn:aws:sns:us-east-1:000000000000:novo-pedido";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const command = new PublishCommand({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(body)
    });

    await sns.send(command);

    return NextResponse.json({ status: "Mensagem publicada no SNS com sucesso." });
  } catch (error) {
    console.error("Erro ao publicar no SNS:", error);
    return NextResponse.json({ error: "Erro ao publicar no SNS." }, { status: 500 });
  }
}
