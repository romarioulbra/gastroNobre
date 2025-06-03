"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FiUpload, FiLoader, FiRefreshCw, FiTrash2 } from "react-icons/fi";

interface Pedido {
  id: string;
  cliente: string;
  itens: string[];
  mesa: number;
  status: string;
  comprovanteUrl?: string;
  createdAt?: string;
}

const pedidosExemplo = [
  { cliente: "Maria", itens: ["Lasanha", "Suco"], mesa: 1 },
  { cliente: "Carlos", itens: ["Hambúrguer", "Refrigerante"], mesa: 2 },
  { cliente: "Ana", itens: ["Sopa", "Água"], mesa: 3 },
  { cliente: "Lucas", itens: ["Pizza", "Cerveja"], mesa: 4 },
  { cliente: "Fernanda", itens: ["Salada", "Chá"], mesa: 5 }
];

import { usePedidoContext } from "../context/PedidoContext";

export default function PedidosAdmin() {
      const { pedidos } = usePedidoContext();
//   const [data, setData] = useState<Pedido[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/pedidos");
      setData(res.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      setErro("Falha ao carregar pedidos. Tente recarregar a página.");
    } finally {
      setLoading(false);
    }
  };

  const importarPedidos = async () => {
    setImporting(true);
    setSucesso(null);
    setErro(null);
    
    try {
      const idsExistentes = new Set(data.map((p) => p.id));
      const pedidosParaImportar = pedidosExemplo.map(pedido => ({
        ...pedido,
        id: uuidv4(),
        status: "pendente",
        createdAt: new Date().toISOString()
      })).filter(pedido => !idsExistentes.has(pedido.id));

      if (pedidosParaImportar.length === 0) {
        setSucesso("Nenhum novo pedido para importar.");
        return;
      }

      const requests = pedidosParaImportar.map(pedido => 
        axios.post("/api/pedidos", pedido)
      );

      await Promise.all(requests);
      await fetchPedidos();
      setSucesso(`${pedidosParaImportar.length} pedidos importados com sucesso!`);
    } catch (error) {
      console.error("Erro ao importar pedidos:", error);
      setErro("Falha ao importar pedidos. Verifique o console para detalhes.");
    } finally {
      setImporting(false);
    }
  };

  const deletarPedido = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este pedido?")) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`/api/pedidos?id=${id}`);
      setSucesso("Pedido excluído com sucesso!");
      await fetchPedidos(); // Atualiza a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      setErro("Falha ao excluir pedido. Verifique o console para detalhes.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const columns: ColumnDef<Pedido>[] = [
    { header: "ID", accessorKey: "id", size: 180 },
    { header: "Cliente", accessorKey: "cliente" },
    { header: "Mesa", accessorKey: "mesa", size: 80 },
    { 
      header: "Itens", 
      accessorFn: (row) => row.itens.join(", "),
      cell: ({ getValue }) => (
        <div className="max-w-xs truncate" title={getValue() as string}>
          {getValue() as string}
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          getValue() === "processado" 
            ? "bg-green-100 text-green-800" 
            : "bg-yellow-100 text-yellow-800"
        }`}>
          {getValue() as string}
        </span>
      )
    },
    {
      header: "Comprovante",
      cell: ({ row }) => (
        row.original.comprovanteUrl ? (
          <a
            href={row.original.comprovanteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Ver PDF
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
      size: 120
    },
    {
      header: "Ações",
      cell: ({ row }) => (
        <button
          onClick={() => deletarPedido(row.original.id)}
          disabled={deletingId === row.original.id}
          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="Excluir pedido"
        >
          {deletingId === row.original.id ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiTrash2 />
          )}
        </button>
      ),
      size: 80
    },
    {
      header: "Data",
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">
          {getValue() ? new Date(getValue() as string).toLocaleString() : '-'}
        </span>
      ),
      size: 160
    }
  ];

 const table = useReactTable({
    data: pedidos,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Pedidos</h1>
        
        <div className="flex gap-3">
          <button
            onClick={fetchPedidos}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition disabled:opacity-50"
          >
            {loading ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiRefreshCw />
            )}
            Atualizar
          </button>
          
          <button
            onClick={importarPedidos}
            disabled={importing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {importing ? (
              <FiLoader className="animate-spin" />
            ) : (
              <FiUpload />
            )}
            Importar Pedidos
          </button>
        </div>
      </div>

      {sucesso && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {sucesso}
        </div>
      )}

      {erro && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {erro}
        </div>
      )}

      <div className="mb-4">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar pedidos..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de {data.length} pedidos
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
          >
            Próxima
          </button>
        </div>
      </div>
    </motion.div>
  );
}