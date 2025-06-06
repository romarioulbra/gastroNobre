// app/api/notificacoes-log/route.ts
import { NextResponse } from "next/server";
import { notificacoes } from "../notificacoes-sns/route";

export async function GET() {
  return NextResponse.json(notificacoes.slice(0, 10)); // retorna as 10 mais recentes
}
