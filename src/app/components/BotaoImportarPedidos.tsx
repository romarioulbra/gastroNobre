"use client";
import { useState } from "react";
import pedidosJson from "../data/pedidos.json";
import axios from "axios";
import { FiUpload, FiLoader } from "react-icons/fi";

interface BotaoImportarPedidosProps {
  onImportado?: () => void;
}

export function BotaoImportarPedidos({ onImportado }: BotaoImportarPedidosProps) {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const importarPedidos = async () => {
    setLoading(true);
    setSucesso(false);
    try {
      const res = await axios.get("/api/pedidos");
      const existentes = new Set(res.data.map((p: any) => p.id));

      for (const pedido of pedidosJson) {
        if (!existentes.has(pedido.id)) {
          await fetch("/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido),
          });
        }
      }

      setSucesso(true);
      onImportado?.();
    } catch (err) {
      console.error("Erro ao importar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={importarPedidos}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? <FiLoader className="animate-spin" /> : <FiUpload />}
        Importar Pedidos
      </button>

      {sucesso && (
        <p className="text-green-600 mt-2">Pedidos importados com sucesso!</p>
      )}
    </div>
  );
}
