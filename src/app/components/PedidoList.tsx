// // // // components/PedidoList.tsx

'use client'

import { useEffect, useState } from 'react'
import { usePedidoContext } from '../context/PedidoContext'
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { FiRefreshCw, FiLoader, FiTrash2, FiCheck, FiClock, FiFileText } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { ModalExclusao } from './ModalExclusao'
import { useNotificacoes } from '../context/NotificacaoContext'
import { NotificacaoMenu } from './NotificacaoMenu'

const ActionButton = ({ children, onClick, className, icon: Icon, variant = 'default', disabled = false }) => {
  const variants = {
    default: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md flex items-center gap-1 text-sm transition-colors ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {Icon && <Icon size={14} className="flex-shrink-0" />}
      <span>{children}</span>
    </motion.button>
  )
}

export default function PedidoList() {
  const { pedidos, fetchPedidos, removerPedido, atualizarStatusPedido, gerarComprovante } = usePedidoContext()
  const [loading, setLoading] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [gerandoComprovante, setGerandoComprovante] = useState<string | null>(null)
  const { adicionarNotificacao } = useNotificacoes()

  const [modalExclusao, setModalExclusao] = useState({
    isOpen: false,
    pedidoId: null as string | null,
  })

  useEffect(() => {
    const carregar = async () => {
      setLoading(true)
      try {
        await fetchPedidos()
      } catch (error) {
        setErro('Erro ao carregar pedidos')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [fetchPedidos])

  const handleConfirmarExclusao = async () => {
    if (!modalExclusao.pedidoId) return
    try {
      await removerPedido(modalExclusao.pedidoId)
      setSucesso('Pedido removido com sucesso!')
    } catch (error) {
      setErro('Erro ao remover pedido')
    } finally {
      setModalExclusao({ isOpen: false, pedidoId: null })
      setTimeout(() => {
        setSucesso(null)
        setErro(null)
      }, 3000)
    }
  }

  const handleGerarComprovante = async (pedidoId: string) => {
    try {
      setGerandoComprovante(pedidoId)
      await gerarComprovante(pedidoId)
      setSucesso('Comprovante gerado com sucesso!')
    } catch (error) {
      setErro('Erro ao gerar comprovante')
    } finally {
      setGerandoComprovante(null)
      setTimeout(() => {
        setSucesso(null)
        setErro(null)
      }, 3000)
    }
  }

  const columns: ColumnDef<Pedido>[] = [
    { header: 'Cliente', accessorKey: 'cliente' },
    { header: 'Mesa', accessorKey: 'mesa' },
    {
      header: 'Itens',
      accessorFn: row => row.itens.join(', '),
      cell: ({ getValue }) => (
        <div title={getValue()} className="max-w-xs truncate text-gray-600">
          {getValue()}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as Pedido['status']
        const colors = {
          pendente: 'bg-yellow-100 text-yellow-800',
          em_preparo: 'bg-blue-100 text-blue-800',
          concluido: 'bg-green-100 text-green-800',
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
            {status === 'pendente' && 'Aguardando'}
            {status === 'em_preparo' && 'Em Preparo'}
            {status === 'concluido' && 'Pronto'}
          </span>
        )
      },
    },
    {
      header: 'Data',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-500">
          {getValue() ? new Date(getValue() as string).toLocaleTimeString() : '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const pedido = row.original
        const nextStatus = pedido.status === 'pendente'
          ? 'em_preparo'
          : pedido.status === 'em_preparo'
          ? 'concluido'
          : 'pendente'

        return (
          <>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              onClick={async () => {
                try {
                  await atualizarStatusPedido(pedido.id, nextStatus)
                  setSucesso(`Status alterado para ${nextStatus}`)
                } catch (error) {
                  setErro('Erro ao atualizar status do pedido')
                } finally {
                  setTimeout(() => {
                    setSucesso(null)
                    setErro(null)
                  }, 3000)
                }
              }}
              variant={pedido.status === 'pendente' ? 'primary' : pedido.status === 'em_preparo' ? 'success' : 'default'}
              icon={pedido.status === 'pendente' ? FiClock : FiCheck}
            >
              {pedido.status === 'pendente' ? 'Preparar' : pedido.status === 'em_preparo' ? 'Concluir' : 'Reiniciar'}
            </ActionButton>

            {pedido.status === 'concluido' && (
              <ActionButton
                onClick={() => handleGerarComprovante(pedido.id)}
                variant="success"
                icon={gerandoComprovante === pedido.id ? FiLoader : FiFileText}
                disabled={gerandoComprovante === pedido.id}
              >
                {gerandoComprovante === pedido.id ? 'Gerando...' : 'PDF'}
              </ActionButton>
            )}

            <ActionButton
              onClick={() => setModalExclusao({ isOpen: true, pedidoId: pedido.id })}
              variant="danger"
              icon={FiTrash2}
            >
              {/* Remover */}
            </ActionButton>
          </div>
          
          </>
          
        )
      },
    },
  ]

  const table = useReactTable({
    data: pedidos,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos Recebidos</h1>
        <ActionButton
          onClick={async () => {
            setLoading(true)
            setSucesso(null)
            setErro(null)
            try {
              await fetchPedidos()
              setSucesso('Pedidos atualizados com sucesso!')
            } catch {
              setErro('Erro ao atualizar pedidos')
            } finally {
              setLoading(false)
              setTimeout(() => {
                setSucesso(null)
                setErro(null)
              }, 3000)
            }
          }}
          disabled={loading}
          variant="default"
          icon={loading ? FiLoader : FiRefreshCw}
        >
          Atualizar
        </ActionButton>
      </div>

      {sucesso && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">{sucesso}</div>}
      {erro && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">{erro}</div>}

      <motion.input
        value={globalFilter}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Buscar pedidos..."
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        whileFocus={{ scale: 1.01 }}
      />

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                  {loading ? 'Carregando...' : 'Nenhum pedido encontrado.'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de {pedidos.length} pedidos
        </div>
        <div className="flex gap-2">
          <ActionButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Anterior
          </ActionButton>
          <ActionButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Próximo
          </ActionButton>
        </div>
      </div>

      <ModalExclusao
        isOpen={modalExclusao.isOpen}
        onClose={() => setModalExclusao({ isOpen: false, pedidoId: null })}
        onConfirm={handleConfirmarExclusao}
        titulo="Confirmar Exclusão"
        mensagem="Deseja realmente excluir este pedido? Esta ação não poderá ser desfeita."
      />
    </div>
  )
}
