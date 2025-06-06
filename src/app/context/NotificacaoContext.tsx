'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface Notificacao {
  id: string
  mensagem: string
  data: Date
  lida: boolean
  pedidoId?: string
}

interface NotificacaoContextType {
  notificacoes: Notificacao[]
  adicionarNotificacao: (mensagem: string, pedidoId?: string) => void
  marcarComoLida: (id: string) => void
  limparNotificacoes: () => void
}

const NotificacaoContext = createContext<NotificacaoContextType>({
  notificacoes: [],
  adicionarNotificacao: () => {},
  marcarComoLida: () => {},
  limparNotificacoes: () => {},
})

export function NotificacaoProvider({ children }: { children: React.ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  useEffect(() => {
    const carregarNotificacoes = () => {
      const salvas = localStorage.getItem('notificacoes')
      if (salvas) {
        try {
          const parsed = JSON.parse(salvas)
          setNotificacoes(parsed.map((n: any) => ({
            ...n,
            data: new Date(n.data)
          })))
        } catch (error) {
          console.error('Erro ao carregar notificações', error)
        }
      }
    }
    carregarNotificacoes()
  }, [])

  useEffect(() => {
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes))
  }, [notificacoes])

  const adicionarNotificacao = (mensagem: string, pedidoId?: string) => {
    const novaNotificacao: Notificacao = {
      id: Date.now().toString(),
      mensagem,
      data: new Date(),
      lida: false,
      pedidoId
    }
    
    setNotificacoes(prev => [novaNotificacao, ...prev])
    
    if (typeof window !== 'undefined' && window.Audio) {
      new Audio('/notification-sound.mp3').play().catch(e => console.error(e))
    }
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ))
  }

  const limparNotificacoes = () => {
    setNotificacoes([])
  }

  return (
    <NotificacaoContext.Provider value={{
      notificacoes,
      adicionarNotificacao,
      marcarComoLida,
      limparNotificacoes
    }}>
      {children}
    </NotificacaoContext.Provider>
  )
}

export const useNotificacoes = () => useContext(NotificacaoContext)

// 'use client'

// import { createContext, useContext, useState, useEffect } from 'react'

// type Notificacao = {
//   id: string
//   mensagem: string
//   data: Date
//   lida: boolean
//   pedidoId?: string
// }

// type NotificacaoContextType = {
//   notificacoes: Notificacao[]
//   adicionarNotificacao: (mensagem: string, pedidoId?: string) => void
//   marcarComoLida: (id: string) => void
//   marcarTodasComoLidas: () => void
// }

// const NotificacaoContext = createContext<NotificacaoContextType>({
//   notificacoes: [],
//   adicionarNotificacao: () => {},
//   marcarComoLida: () => {},
//   marcarTodasComoLidas: () => {},
// })

// export function NotificacaoProvider({ children }: { children: React.ReactNode }) {
//   const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

//   // Simula a conexão com o SNS (em produção, você usaria WebSockets ou polling)
//   useEffect(() => {
//     // Em ambiente de desenvolvimento, podemos simular eventos do SNS
//     if (process.env.NODE_ENV === 'development') {
//       const handlePedidoConcluido = (event: MessageEvent) => {
//         try {
//           const data = JSON.parse(event.data)
//           if (data.TopicArn?.includes('PedidosConcluidos')) {
//             adicionarNotificacao(data.Message, data.Message.match(/\d+/)?.[0])
//           }
//         } catch (error) {
//           console.error('Erro ao processar mensagem SNS:', error)
//         }
//       }

//       // Simulando um EventSource para SNS (em produção, use a conexão real)
//       const eventSource = new EventSource('/api/sns-events')
//       eventSource.onmessage = handlePedidoConcluido

//       return () => eventSource.close()
//     }
//   }, [])

//   const adicionarNotificacao = (mensagem: string, pedidoId?: string) => {
//     const novaNotificacao: Notificacao = {
//       id: Date.now().toString(),
//       mensagem,
//       data: new Date(),
//       lida: false,
//       pedidoId
//     }

//     setNotificacoes(prev => [novaNotificacao, ...prev])
    
//     // Tocar som de notificação (opcional)
//     if (typeof window !== 'undefined' && window.Audio) {
//       new Audio('/notification.mp3').play().catch(console.error)
//     }
//   }

//   const marcarComoLida = (id: string) => {
//     setNotificacoes(prev =>
//       prev.map(n => (n.id === id ? { ...n, lida: true } : n)
//     )
//   }

//   const marcarTodasComoLidas = () => {
//     setNotificacoes(prev => prev.map(n => ({ ...n, lida: true }))
//   }

//   return (
//     <NotificacaoContext.Provider
//       value={{
//         notificacoes,
//         adicionarNotificacao,
//         marcarComoLida,
//         marcarTodasComoLidas,
//       }}
//     >
//       {children}
//     </NotificacaoContext.Provider>
//   )
// }

// export const useNotificacoes = () => useContext(NotificacaoContext)