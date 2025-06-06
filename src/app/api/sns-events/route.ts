import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  // Em produção, você se conectaria ao SNS real aqui
  if (process.env.NODE_ENV === 'development') {
    // Simulador de eventos para desenvolvimento
    const interval = setInterval(() => {
      // Não envia nada automaticamente, apenas mantém a conexão aberta
    }, 5000)

    req.on('close', () => {
      clearInterval(interval)
      res.end()
    })
  }
}