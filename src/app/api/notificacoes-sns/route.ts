// app/api/notificacoes-sns/route.ts
import { NextRequest, NextResponse } from "next/server";

let notificacoes: { message: string; subject: string; timestamp: string }[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.Type === "SubscriptionConfirmation") {
    console.log("⚠️ SNS Subscription - confirme:", body.SubscribeURL);
    return NextResponse.json({ ok: true });
  }

  if (body.Type === "Notification") {
    console.log("📨 SNS Notificação recebida:", body.Message);
    notificacoes.unshift({
      message: body.Message,
      subject: body.Subject ?? "Notificação",
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}

export { notificacoes }; // para importar no GET
