// // context/PedidoContext.tsx
// 'use client'

// import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// export type PedidoStatus = 'pendente' | 'em_preparo' | 'concluido'

// export interface Pedido {
//   id: string
//   cliente: string
//   mesa: number
//   itens: string[]
//   status: PedidoStatus
//   createdAt: string
// }

// interface PedidoContextType {
//   pedidos: Pedido[]
//   fetchPedidos: () => Promise<void>
//   adicionarPedido: (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => Promise<void>
//   removerPedido: (id: string) => Promise<void>
// }

// const PedidoContext = createContext<PedidoContextType>({
//   pedidos: [],
//   fetchPedidos: async () => {},
//   adicionarPedido: async () => {},
//   removerPedido: async () => {},
// })

// export function PedidoProvider({ children }: { children: React.ReactNode }) {
//   const [pedidos, setPedidos] = useState<Pedido[]>([])

//   const fetchPedidos = useCallback(async () => {
//     try {
//       const response = await fetch('/api/pedidos')
//       if (!response.ok) {
//         throw new Error('Erro ao buscar pedidos')
//       }
//       const data = await response.json()
//       setPedidos(data)
//     } catch (error) {
//       console.error('Erro ao buscar pedidos:', error)
//     }
//   }, [])

//   const adicionarPedido = useCallback(async (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => {
//     try {
//       const response = await fetch('/api/pedidos', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(pedido),
//       })

//       if (!response.ok) {
//         throw new Error('Erro ao adicionar pedido')
//       }

//       const novoPedido = await response.json()
//       setPedidos(prev => [...prev, novoPedido])
//     } catch (error) {
//       console.error('Erro ao adicionar pedido:', error)
//       throw error
//     }
//   }, [])

//   const removerPedido = useCallback(async (id: string) => {
//     try {
//       const response = await fetch(`/api/pedidos?id=${id}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         throw new Error('Erro ao remover pedido')
//       }

//       setPedidos(prev => prev.filter(p => p.id !== id))
//     } catch (error) {
//       console.error('Erro ao remover pedido:', error)
//       throw error
//     }
//   }, [])

//   useEffect(() => {
//     fetchPedidos()
//   }, [fetchPedidos])

//   return (
//     <PedidoContext.Provider value={{ pedidos, fetchPedidos, adicionarPedido, removerPedido }}>
//       {children}
//     </PedidoContext.Provider>
//   )
// }

// export const usePedidoContext = () => useContext(PedidoContext)


'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type PedidoStatus = 'pendente' | 'em_preparo' | 'concluido'

export interface Pedido {
  id: string
  cliente: string
  mesa: number
  itens: string[]
  status: PedidoStatus
  createdAt: string
}

interface PedidoContextType {
  pedidos: Pedido[]
  fetchPedidos: () => Promise<void>
  adicionarPedido: (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => Promise<void>
  removerPedido: (id: string) => Promise<void>
  atualizarStatusPedido: (id: string, status: PedidoStatus) => Promise<void>
}

const PedidoContext = createContext<PedidoContextType>({
  pedidos: [],
  fetchPedidos: async () => {},
  adicionarPedido: async () => {},
  removerPedido: async () => {},
  atualizarStatusPedido: async () => {},
})

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  const fetchPedidos = useCallback(async () => {
    try {
      const response = await fetch('/api/pedidos')
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos')
      }
      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      throw error
    }
  }, [])

  const adicionarPedido = useCallback(async (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar pedido')
      }

      const novoPedido = await response.json()
      setPedidos(prev => [...prev, novoPedido])
      return novoPedido
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error)
      throw error
    }
  }, [])

  const removerPedido = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/pedidos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover pedido')
      }

      setPedidos(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Erro ao remover pedido:', error)
      throw error
    }
  }, [])

  const atualizarStatusPedido = useCallback(async (id: string, status: PedidoStatus) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido')
      }

      const data = await response.json()
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p))
      return data
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])

  return (
    <PedidoContext.Provider value={{ 
      pedidos, 
      fetchPedidos, 
      adicionarPedido, 
      removerPedido,
      atualizarStatusPedido
    }}>
      {children}
    </PedidoContext.Provider>
  )
}

export const usePedidoContext = () => useContext(PedidoContext)