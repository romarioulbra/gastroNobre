'use client'

import { useEffect, useState } from 'react'
import PedidoCard from './PedidoCard' // ajuste o caminho conforme seu projeto

type Pedido = {
  id: string
  cliente: string
  itens: string[]
  total: number
  status: string
  mesa: number
  createdAt: string
}

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch('/api/pedidos')
        const data: Pedido[] = await res.json()

        // Calcular total por pedido
        const pedidosComTotal = data.map(pedido => {
          return {
            ...pedido,
            total: calcularTotal(pedido.itens)
          }
        })

        setPedidos(pedidosComTotal)
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  function calcularTotal(itens: string[]): number {
    // Supondo que o nome dos itens tenha o preço embutido ou que o preço venha depois
    // Aqui vamos simular que cada item vale R$10 só para fins de exemplo
    return itens.length * 10
  }

  if (loading) return <p>Carregando pedidos...</p>

  if (pedidos.length === 0) return <p>Nenhum pedido encontrado.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* {pedidos.map(pedido => (
        <PedidoCard
          key={pedido.id}
          cliente={pedido.cliente}
          itens={pedido.itens}
          total={pedido.total}
          status={pedido.status}
        />
      ))} */}

      {pedidos.map(pedido => (
  <div key={pedido.id}>
    {pedido.cliente} - Total: R${pedido.total}
  </div>
))}

    </div>
  )
}
