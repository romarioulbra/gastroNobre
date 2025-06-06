// 'use client'

// import { createContext, useContext, useState, useEffect } from 'react'

// interface Notificacao {
//   id: string
//   mensagem: string
//   data: Date
//   lida: boolean
//   pedidoId?: string
// }

// interface NotificacaoContextType {
//   notificacoes: Notificacao[]
//   adicionarNotificacao: (mensagem: string, pedidoId?: string) => void
//   marcarComoLida: (id: string) => void
//   limparNotificacoes: () => void
// }

// const NotificacaoContext = createContext<NotificacaoContextType>({
//   notificacoes: [],
//   adicionarNotificacao: () => {},
//   marcarComoLida: () => {},
//   limparNotificacoes: () => {},
// })

// export function NotificacaoProvider({ children }: { children: React.ReactNode }) {
//   const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

//   useEffect(() => {
//     const carregarNotificacoes = () => {
//       const salvas = localStorage.getItem('notificacoes')
//       if (salvas) {
//         try {
//           const parsed = JSON.parse(salvas)
//           setNotificacoes(parsed.map((n: any) => ({
//             ...n,
//             data: new Date(n.data)
//           })))
//         } catch (error) {
//           console.error('Erro ao carregar notificações', error)
//         }
//       }
//     }
//     carregarNotificacoes()
//   }, [])

//   useEffect(() => {
//     localStorage.setItem('notificacoes', JSON.stringify(notificacoes))
//   }, [notificacoes])

//   const adicionarNotificacao = (mensagem: string, pedidoId?: string) => {
//     const novaNotificacao: Notificacao = {
//       id: Date.now().toString(),
//       mensagem,
//       data: new Date(),
//       lida: false,
//       pedidoId
//     }
    
//     setNotificacoes(prev => [novaNotificacao, ...prev])
    
//     if (typeof window !== 'undefined' && window.Audio) {
//       new Audio('/notification-sound.mp3').play().catch(e => console.error(e))
//     }
//   }

//   const marcarComoLida = (id: string) => {
//     setNotificacoes(prev => prev.map(n => 
//       n.id === id ? { ...n, lida: true } : n
//     ))
//   }

//   const limparNotificacoes = () => {
//     setNotificacoes([])
//   }

//   return (
//     <NotificacaoContext.Provider value={{
//       notificacoes,
//       adicionarNotificacao,
//       marcarComoLida,
//       limparNotificacoes
//     }}>
//       {children}
//     </NotificacaoContext.Provider>
//   )
// }

// export const useNotificacoes = () => useContext(NotificacaoContext)


// context/NotificacaoContext.tsx
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
  marcarTodasComoLidas: () => void
  limparNotificacoes: () => void
  naoLidasCount: number,
}

const NotificacaoContext = createContext<NotificacaoContextType>({
  notificacoes: [],
  adicionarNotificacao: () => {},
  marcarComoLida: () => {},
  marcarTodasComoLidas: () => {},
  limparNotificacoes: () => {},
  naoLidasCount: 0,
})

export function NotificacaoProvider({ children }: { children: React.ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])

  // Carrega notificações salvas no localStorage
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

  // Salva notificações no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes))
  }, [notificacoes])

  const naoLidasCount = notificacoes.filter(n => !n.lida).length

  const adicionarNotificacao = (mensagem: string, pedidoId?: string) => {
    const novaNotificacao: Notificacao = {
      id: Date.now().toString(),
      mensagem,
      data: new Date(),
      lida: false,
      pedidoId
    }
    
    setNotificacoes(prev => [novaNotificacao, ...prev])
    
    // Toca som de notificação se disponível
    if (typeof window !== 'undefined' && window.Audio) {
      new Audio('/notification-sound.mp3').play().catch(e => console.error(e))
    }
  }

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => prev.map(n => 
      n.id === id ? { ...n, lida: true } : n
    ))
  }

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  const limparNotificacoes = () => {
    setNotificacoes([])
  }

  return (
    <NotificacaoContext.Provider value={{
      notificacoes,
      adicionarNotificacao,
      marcarComoLida,
      marcarTodasComoLidas,
      limparNotificacoes,
      naoLidasCount
    }}>
      {children}
    </NotificacaoContext.Provider>
  )
}

export const useNotificacoes = () => useContext(NotificacaoContext)