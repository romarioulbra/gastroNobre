// // // components/PedidoList.tsx
// 'use client'

// import { useEffect, useState } from 'react'
// import { usePedidoContext } from '../context/PedidoContext'
// import {
//   ColumnDef,
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from '@tanstack/react-table'
// import { FiRefreshCw, FiLoader, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'

// export default function PedidoList() {
//   const { pedidos, fetchPedidos, removerPedido, atualizarStatusPedido } = usePedidoContext()
//   const [loading, setLoading] = useState(false)
//   const [globalFilter, setGlobalFilter] = useState('')
//   const [sucesso, setSucesso] = useState<string | null>(null)
//   const [erro, setErro] = useState<string | null>(null)

//   useEffect(() => {
//     const carregar = async () => {
//       setLoading(true)
//       try {
//         await fetchPedidos()
//       } catch (error) {
//         setErro('Erro ao carregar pedidos')
//       } finally {
//         setLoading(false)
//       }
//     }
//     carregar()
//   }, [fetchPedidos])

//   const columns: ColumnDef<Pedido>[] = [
//     { 
//       header: 'Cliente', 
//       accessorKey: 'cliente',
//       cell: ({ getValue }) => (
//         <span className="font-medium text-gray-800">
//           {getValue() as string}
//         </span>
//       )
//     },
//     { 
//       header: 'Mesa', 
//       accessorKey: 'mesa',
//       cell: ({ getValue }) => (
//         <span className="font-medium">
//           {getValue() as string}
//         </span>
//       )
//     },
//     {
//       header: 'Itens',
//       accessorFn: row => row.itens.join(', '),
//       cell: ({ getValue }) => (
//         <div title={getValue() as string} className="max-w-xs truncate text-gray-600">
//           {getValue() as string}
//         </div>
//       ),
//     },
//     {
//       header: 'Status',
//       accessorKey: 'status',
//       cell: ({ getValue, row }) => {
//         const status = getValue() as Pedido['status']
//         const colors = {
//           pendente: 'bg-yellow-100 text-yellow-800',
//           em_preparo: 'bg-blue-100 text-blue-800',
//           concluido: 'bg-green-100 text-green-800',
//         }
        
//         const nextStatus = {
//           pendente: 'em_preparo',
//           em_preparo: 'concluido',
//           concluido: 'pendente'
//         }
        
//         return (
//           <div className="flex items-center gap-2">
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>
//               {status === 'pendente' && 'Aguardando'}
//               {status === 'em_preparo' && 'Em Preparo'}
//               {status === 'concluido' && 'Pronto'}
//             </span>
//           </div>
//         )
//       },
//     },
//     {
//       header: 'Data',
//       accessorKey: 'createdAt',
//       cell: ({ getValue }) => (
//         <span className="text-sm text-gray-500">
//           {getValue() ? new Date(getValue() as string).toLocaleTimeString() : '-'}
//         </span>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Ações',
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           <button
//             onClick={async (e) => {
//               e.stopPropagation()
//               try {
//                 const newStatus = row.original.status === 'pendente' ? 'em_preparo' : 'concluido'
//                 await atualizarStatusPedido(row.original.id, newStatus)
//                 setSucesso(`Status alterado para ${
//                   newStatus === 'em_preparo' ? 'Em Preparo' : 'Pronto'
//                 }`)
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar status do pedido')
//                 setTimeout(() => setErro(null), 3000)
//               }
//             }}
//             className={`p-2 rounded-md flex items-center gap-1 text-sm ${
//               row.original.status === 'pendente' 
//                 ? 'bg-blue-500 hover:bg-blue-600 text-white' 
//                 : row.original.status === 'em_preparo'
//                 ? 'bg-green-500 hover:bg-green-600 text-white'
//                 : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//             }`}
//           >
//             {row.original.status === 'pendente' ? (
//               <>
//                 <FiClock size={14} />
//                 <span>Preparar</span>
//               </>
//             ) : row.original.status === 'em_preparo' ? (
//               <>
//                 <FiCheck size={14} />
//                 <span>Concluir</span>
//               </>
//             ) : (
//               <>
//                 <FiClock size={14} />
//                 <span>Reiniciar</span>
//               </>
//             )}
//           </button>
//           <button
//             onClick={async (e) => {
//               e.stopPropagation()
//               if (confirm('Tem certeza que deseja excluir este pedido?')) {
//                 try {
//                   await removerPedido(row.original.id)
//                   setSucesso('Pedido removido com sucesso!')
//                   setTimeout(() => setSucesso(null), 3000)
//                 } catch (error) {
//                   setErro('Erro ao remover pedido')
//                   setTimeout(() => setErro(null), 3000)
//                 }
//               }
//             }}
//             className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 text-sm"
//           >
//             <FiTrash2 size={14} />
//             <span>Remover</span>
//           </button>
//         </div>
//       ),
//     },
//   ]

//   const table = useReactTable({
//     data: pedidos,
//     columns,
//     state: { globalFilter },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   })

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Pedidos Recebidos</h1>

//         <div className="flex gap-3">
//           <button
//             onClick={async () => {
//               setLoading(true)
//               setSucesso(null)
//               setErro(null)
//               try {
//                 await fetchPedidos()
//                 setSucesso('Pedidos atualizados com sucesso!')
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar pedidos')
//                 setTimeout(() => setErro(null), 3000)
//               } finally {
//                 setLoading(false)
//               }
//             }}
//             disabled={loading}
//             className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition disabled:opacity-50"
//           >
//             {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
//             Atualizar
//           </button>
//         </div>
//       </div>

//       {sucesso && (
//         <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md animate-fade-in">
//           {sucesso}
//         </div>
//       )}
//       {erro && (
//         <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md animate-fade-in">
//           {erro}
//         </div>
//       )}

//       <div className="mb-4">
//         <input
//           value={globalFilter}
//           onChange={e => setGlobalFilter(e.target.value)}
//           placeholder="Buscar pedidos..."
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//         />
//       </div>

//       <div className="overflow-x-auto border border-gray-200 rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th
//                     key={header.id}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: header.getSize() }}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {table.getRowModel().rows.length === 0 && (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6 text-gray-500">
//                   {loading ? 'Carregando...' : 'Nenhum pedido encontrado.'}
//                 </td>
//               </tr>
//             )}
//             {table.getRowModel().rows.map(row => (
//               <tr key={row.id} className="hover:bg-gray-50">
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id} className="px-4 py-3 text-sm">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
//         <div className="text-sm text-gray-600">
//           Mostrando {table.getRowModel().rows.length} de {pedidos.length} pedidos
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Anterior
//           </button>
//           <button
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Próximo
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }



// 'use client'

// import { useEffect, useState } from 'react'
// import { usePedidoContext } from '../context/PedidoContext'
// import {
//   ColumnDef,
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from '@tanstack/react-table'
// import { FiRefreshCw, FiLoader, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
// import { motion } from 'framer-motion'

// // Componente de botão animado
// const AnimatedButton = ({ 
//   children, 
//   className, 
//   onClick,
//   whileHover = { scale: 1.05 },
//   whileTap = { scale: 0.95 },
//   transition = { type: 'spring', stiffness: 400, damping: 17 }
// }) => (
//   <motion.button
//     whileHover={whileHover}
//     whileTap={whileTap}
//     transition={transition}
//     onClick={onClick}
//     className={className}
//   >
//     {children}
//   </motion.button>
// )

// export default function PedidoList() {
//   const { pedidos, fetchPedidos, removerPedido, atualizarStatusPedido } = usePedidoContext()
//   const [loading, setLoading] = useState(false)
//   const [globalFilter, setGlobalFilter] = useState('')
//   const [sucesso, setSucesso] = useState<string | null>(null)
//   const [erro, setErro] = useState<string | null>(null)

//   useEffect(() => {
//     const carregar = async () => {
//       setLoading(true)
//       try {
//         await fetchPedidos()
//       } catch (error) {
//         setErro('Erro ao carregar pedidos')
//       } finally {
//         setLoading(false)
//       }
//     }
//     carregar()
//   }, [fetchPedidos])

//   const columns: ColumnDef<Pedido>[] = [
//     { 
//       header: 'Cliente', 
//       accessorKey: 'cliente',
//       cell: ({ getValue }) => (
//         <span className="font-medium text-gray-800">
//           {getValue() as string}
//         </span>
//       )
//     },
//     { 
//       header: 'Mesa', 
//       accessorKey: 'mesa',
//       cell: ({ getValue }) => (
//         <span className="font-medium">
//           {getValue() as string}
//         </span>
//       )
//     },
//     {
//       header: 'Itens',
//       accessorFn: row => row.itens.join(', '),
//       cell: ({ getValue }) => (
//         <div title={getValue() as string} className="max-w-xs truncate text-gray-600">
//           {getValue() as string}
//         </div>
//       ),
//     },
//     {
//       header: 'Status',
//       accessorKey: 'status',
//       cell: ({ getValue, row }) => {
//         const status = getValue() as Pedido['status']
//         const colors = {
//           pendente: 'bg-yellow-100 text-yellow-800',
//           em_preparo: 'bg-blue-100 text-blue-800',
//           concluido: 'bg-green-100 text-green-800',
//         }
        
//         const nextStatus = {
//           pendente: 'em_preparo',
//           em_preparo: 'concluido',
//           concluido: 'pendente'
//         }
        
//         return (
//           <div className="flex items-center gap-2">
//             <motion.span 
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}
//             >
//               {status === 'pendente' && 'Aguardando'}
//               {status === 'em_preparo' && 'Em Preparo'}
//               {status === 'concluido' && 'Pronto'}
//             </motion.span>
//           </div>
//         )
//       },
//     },
//     {
//       header: 'Data',
//       accessorKey: 'createdAt',
//       cell: ({ getValue }) => (
//         <span className="text-sm text-gray-500">
//           {getValue() ? new Date(getValue() as string).toLocaleTimeString() : '-'}
//         </span>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Ações',
//       cell: ({ row }) => (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex gap-2"
//         >
//           <AnimatedButton
//             onClick={async (e) => {
//               e.stopPropagation()
//               try {
//                 const newStatus = row.original.status === 'pendente' ? 'em_preparo' : 'concluido'
//                 await atualizarStatusPedido(row.original.id, newStatus)
//                 setSucesso(`Status alterado para ${
//                   newStatus === 'em_preparo' ? 'Em Preparo' : 'Pronto'
//                 }`)
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar status do pedido')
//                 setTimeout(() => setErro(null), 3000)
//               }
//             }}
//             className={`p-2 rounded-md flex items-center gap-1 text-sm ${
//               row.original.status === 'pendente' 
//                 ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20' 
//                 : row.original.status === 'em_preparo'
//                 ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
//                 : 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-gray-500/10'
//             } shadow-md`}
//             whileHover={{ 
//               scale: 1.05,
//               boxShadow: row.original.status === 'pendente' 
//                 ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' 
//                 : row.original.status === 'em_preparo'
//                 ? '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
//                 : '0 10px 15px -3px rgba(156, 163, 175, 0.3)'
//             }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {row.original.status === 'pendente' ? (
//               <>
//                 <FiClock size={14} />
//                 <span>Preparar</span>
//               </>
//             ) : row.original.status === 'em_preparo' ? (
//               <>
//                 <FiCheck size={14} />
//                 <span>Concluir</span>
//               </>
//             ) : (
//               <>
//                 <FiClock size={14} />
//                 <span>Reiniciar</span>
//               </>
//             )}
//           </AnimatedButton>
          
//           <AnimatedButton
//             onClick={async (e) => {
//               e.stopPropagation()
//               if (confirm('Tem certeza que deseja excluir este pedido?')) {
//                 try {
//                   await removerPedido(row.original.id)
//                   setSucesso('Pedido removido com sucesso!')
//                   setTimeout(() => setSucesso(null), 3000)
//                 } catch (error) {
//                   setErro('Erro ao remover pedido')
//                   setTimeout(() => setErro(null), 3000)
//                 }
//               }
//             }}
//             className="p-2 rounded-md bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 text-sm shadow-md shadow-red-500/20"
//             whileHover={{ 
//               scale: 1.05,
//               boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
//             }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FiTrash2 size={14} />
//             <span>Remover</span>
//           </AnimatedButton>
//         </motion.div>
//       ),
//     },
//   ]

//   const table = useReactTable({
//     data: pedidos,
//     columns,
//     state: { globalFilter },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   })

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Pedidos Recebidos</h1>

//         <div className="flex gap-3">
//           <AnimatedButton
//             onClick={async () => {
//               setLoading(true)
//               setSucesso(null)
//               setErro(null)
//               try {
//                 await fetchPedidos()
//                 setSucesso('Pedidos atualizados com sucesso!')
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar pedidos')
//                 setTimeout(() => setErro(null), 3000)
//               } finally {
//                 setLoading(false)
//               }
//             }}
//             disabled={loading}
//             className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition disabled:opacity-50 shadow-md shadow-gray-500/10"
//             whileHover={{ 
//               scale: 1.03,
//               boxShadow: '0 10px 15px -3px rgba(156, 163, 175, 0.3)'
//             }}
//             whileTap={{ scale: 0.97 }}
//           >
//             {loading ? <FiLoader className="animate-spin" /> : <FiRefreshCw />}
//             Atualizar
//           </AnimatedButton>
//         </div>
//       </div>

//       {sucesso && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="mb-4 p-3 bg-green-100 text-green-800 rounded-md"
//         >
//           {sucesso}
//         </motion.div>
//       )}
//       {erro && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="mb-4 p-3 bg-red-100 text-red-800 rounded-md"
//         >
//           {erro}
//         </motion.div>
//       )}

//       <div className="mb-4">
//         <motion.input
//           value={globalFilter}
//           onChange={e => setGlobalFilter(e.target.value)}
//           placeholder="Buscar pedidos..."
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//           whileFocus={{
//             boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)'
//           }}
//           transition={{ type: 'spring', stiffness: 400 }}
//         />
//       </div>

//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm"
//       >
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th
//                     key={header.id}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: header.getSize() }}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {table.getRowModel().rows.length === 0 && (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6 text-gray-500">
//                   {loading ? 'Carregando...' : 'Nenhum pedido encontrado.'}
//                 </td>
//               </tr>
//             )}
//             {table.getRowModel().rows.map((row, index) => (
//               <motion.tr 
//                 key={row.id} 
//                 className="hover:bg-gray-50"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//               >
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id} className="px-4 py-3 text-sm">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>

//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
//         <div className="text-sm text-gray-600">
//           Mostrando {table.getRowModel().rows.length} de {pedidos.length} pedidos
//         </div>

//         <div className="flex gap-2">
//           <AnimatedButton
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="px-3 py-1 border rounded disabled:opacity-50 shadow-sm"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Anterior
//           </AnimatedButton>
//           <AnimatedButton
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="px-3 py-1 border rounded disabled:opacity-50 shadow-sm"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Próximo
//           </AnimatedButton>
//         </div>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import { useEffect, useState } from 'react'
// import { usePedidoContext } from '../context/PedidoContext'
// import {
//   ColumnDef,
//   useReactTable,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from '@tanstack/react-table'
// import { FiRefreshCw, FiLoader, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
// import { motion } from 'framer-motion'
// import { ModalExclusao } from './ModalExclusao'
// // Componente de botão de ação com animação
// const ActionButton = ({ 
//   children, 
//   onClick, 
//   className,
//   icon: Icon,
//   variant = 'default'
// }) => {
//   const variants = {
//     default: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
//     primary: 'bg-blue-500 hover:bg-blue-600 text-white',
//     success: 'bg-green-500 hover:bg-green-600 text-white',
//     danger: 'bg-red-500 hover:bg-red-600 text-white',
//   }

//   // Dentro do componente PedidoList, adicione o estado do modal
// const [modalExclusao, setModalExclusao] = useState({
//   isOpen: false,
//   pedidoId: null as string | null,
// })

  
//   return (
//     <motion.button
//       onClick={onClick}
//       className={`p-2 rounded-md flex items-center gap-1 text-sm transition-colors ${variants[variant]} ${className}`}
//       whileHover={{ 
//         scale: 1.05,
//         boxShadow: variant === 'danger' 
//           ? '0 4px 6px -1px rgba(239, 68, 68, 0.3)' 
//           : variant === 'primary'
//           ? '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
//           : variant === 'success'
//           ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
//           : '0 4px 6px -1px rgba(156, 163, 175, 0.3)'
//       }}
//       whileTap={{ scale: 0.95 }}
//       transition={{ type: 'spring', stiffness: 400, damping: 10 }}
//     >
//       {Icon && <Icon size={14} className="flex-shrink-0" />}
//       <span>{children}</span>
//     </motion.button>
//   )
// }

// export default function PedidoList() {
//   const { pedidos, fetchPedidos, removerPedido, atualizarStatusPedido } = usePedidoContext()
//   const [loading, setLoading] = useState(false)
//   const [globalFilter, setGlobalFilter] = useState('')
//   const [sucesso, setSucesso] = useState<string | null>(null)
//   const [erro, setErro] = useState<string | null>(null)

//   useEffect(() => {
//     const carregar = async () => {
//       setLoading(true)
//       try {
//         await fetchPedidos()
//       } catch (error) {
//         setErro('Erro ao carregar pedidos')
//       } finally {
//         setLoading(false)
//       }
//     }
//     carregar()
//   }, [fetchPedidos])

//   const columns: ColumnDef<Pedido>[] = [
//     { 
//       header: 'Cliente', 
//       accessorKey: 'cliente',
//       cell: ({ getValue }) => (
//         <span className="font-medium text-gray-800">
//           {getValue() as string}
//         </span>
//       )
//     },
//     { 
//       header: 'Mesa', 
//       accessorKey: 'mesa',
//       cell: ({ getValue }) => (
//         <span className="font-medium">
//           {getValue() as string}
//         </span>
//       )
//     },
//     {
//       header: 'Itens',
//       accessorFn: row => row.itens.join(', '),
//       cell: ({ getValue }) => (
//         <div title={getValue() as string} className="max-w-xs truncate text-gray-600">
//           {getValue() as string}
//         </div>
//       ),
//     },
//     {
//       header: 'Status',
//       accessorKey: 'status',
//       cell: ({ getValue, row }) => {
//         const status = getValue() as Pedido['status']
//         const colors = {
//           pendente: 'bg-yellow-100 text-yellow-800',
//           em_preparo: 'bg-blue-100 text-blue-800',
//           concluido: 'bg-green-100 text-green-800',
//         }
        
//         return (
//           <motion.div 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex items-center gap-2"
//           >
//             <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || ''}`}>
//               {status === 'pendente' && 'Aguardando'}
//               {status === 'em_preparo' && 'Em Preparo'}
//               {status === 'concluido' && 'Pronto'}
//             </span>
//           </motion.div>
//         )
//       },
//     },
//     {
//       header: 'Data',
//       accessorKey: 'createdAt',
//       cell: ({ getValue }) => (
//         <span className="text-sm text-gray-500">
//           {getValue() ? new Date(getValue() as string).toLocaleTimeString() : '-'}
//         </span>
//       ),
//     },
//     {
//       id: 'actions',
//       header: 'Ações',
//       cell: ({ row }) => (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.1 }}
//           className="flex gap-2"
//         >
//           <ActionButton
//             onClick={async (e) => {
//               e.stopPropagation()
//               try {
//                 const newStatus = row.original.status === 'pendente' ? 'em_preparo' : 'concluido'
//                 await atualizarStatusPedido(row.original.id, newStatus)
//                 setSucesso(`Status alterado para ${
//                   newStatus === 'em_preparo' ? 'Em Preparo' : 'Pronto'
//                 }`)
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar status do pedido')
//                 setTimeout(() => setErro(null), 3000)
//               }
//             }}
//             variant={
//               row.original.status === 'pendente' 
//                 ? 'primary' 
//                 : row.original.status === 'em_preparo'
//                 ? 'success'
//                 : 'default'
//             }
//             icon={
//               row.original.status === 'pendente' 
//                 ? FiClock 
//                 : row.original.status === 'em_preparo'
//                 ? FiCheck
//                 : FiClock
//             }
//           >
//             {row.original.status === 'pendente' 
//               ? 'Preparar' 
//               : row.original.status === 'em_preparo'
//               ? 'Concluir'
//               : 'Reiniciar'}
//           </ActionButton>
          
//           <ActionButton
//             onClick={async (e) => {
//               e.stopPropagation()
//               if (confirm('Tem certeza que deseja excluir este pedido?')) {
//                 try {
//                   await removerPedido(row.original.id)
//                   setSucesso('Pedido removido com sucesso!')
//                   setTimeout(() => setSucesso(null), 3000)
//                 } catch (error) {
//                   setErro('Erro ao remover pedido')
//                   setTimeout(() => setErro(null), 3000)
//                 }
//               }
//             }}
//             variant="danger"
//             icon={FiTrash2}
//           >
//             Remover
//           </ActionButton>
//         </motion.div>
//       ),
//     },
//   ]

//   const table = useReactTable({
//     data: pedidos,
//     columns,
//     state: { globalFilter },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   })

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Pedidos Recebidos</h1>

//         <div className="flex gap-3">
//           <ActionButton
//             onClick={async () => {
//               setLoading(true)
//               setSucesso(null)
//               setErro(null)
//               try {
//                 await fetchPedidos()
//                 setSucesso('Pedidos atualizados com sucesso!')
//                 setTimeout(() => setSucesso(null), 3000)
//               } catch (error) {
//                 setErro('Erro ao atualizar pedidos')
//                 setTimeout(() => setErro(null), 3000)
//               } finally {
//                 setLoading(false)
//               }
//             }}
//             disabled={loading}
//             variant="default"
//             icon={loading ? FiLoader : FiRefreshCw}
//             className={loading ? 'opacity-50' : ''}
//           >
//             Atualizar
//           </ActionButton>
//         </div>
//       </div>

//       {sucesso && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 p-3 bg-green-100 text-green-800 rounded-md"
//         >
//           {sucesso}
//         </motion.div>
//       )}
//       {erro && (
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 p-3 bg-red-100 text-red-800 rounded-md"
//         >
//           {erro}
//         </motion.div>
//       )}

//       <div className="mb-4">
//         <motion.input
//           value={globalFilter}
//           onChange={e => setGlobalFilter(e.target.value)}
//           placeholder="Buscar pedidos..."
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//           whileFocus={{
//             scale: 1.005,
//             boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
//           }}
//           transition={{ type: 'spring', stiffness: 400 }}
//         />
//       </div>

//       <div className="overflow-x-auto border border-gray-200 rounded-lg">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             {table.getHeaderGroups().map(headerGroup => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <th
//                     key={header.id}
//                     className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     style={{ width: header.getSize() }}
//                   >
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {table.getRowModel().rows.length === 0 && (
//               <tr>
//                 <td colSpan={columns.length} className="text-center py-6 text-gray-500">
//                   {loading ? 'Carregando...' : 'Nenhum pedido encontrado.'}
//                 </td>
//               </tr>
//             )}
//             {table.getRowModel().rows.map((row, index) => (
//               <motion.tr 
//                 key={row.id} 
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="hover:bg-gray-50"
//               >
//                 {row.getVisibleCells().map(cell => (
//                   <td key={cell.id} className="px-4 py-3 text-sm">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </td>
//                 ))}
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
//         <div className="text-sm text-gray-600">
//           Mostrando {table.getRowModel().rows.length} de {pedidos.length} pedidos
//         </div>

//         <div className="flex gap-2">
//           <ActionButton
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             variant="default"
//             className={!table.getCanPreviousPage() ? 'opacity-50' : ''}
//           >
//             Anterior
//           </ActionButton>
//           <ActionButton
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             variant="default"
//             className={!table.getCanNextPage() ? 'opacity-50' : ''}
//           >
//             Próximo
//           </ActionButton>
//         </div>
//       </div>
//     </div>
//   )
// }

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
import { FiRefreshCw, FiLoader, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { ModalExclusao } from './ModalExclusao'

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
  const { pedidos, fetchPedidos, removerPedido, atualizarStatusPedido } = usePedidoContext()
  const [loading, setLoading] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

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
          <div className="flex gap-2">
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

            <ActionButton
              onClick={() =>
                setModalExclusao({ isOpen: true, pedidoId: pedido.id })
              }
              variant="danger"
              icon={FiTrash2}
            >
              Remover
            </ActionButton>
          </div>
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
