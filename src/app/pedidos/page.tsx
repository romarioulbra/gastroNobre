"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import pedidos from "@/app/data/pedidos.json";
import { useState } from "react";

export function BotaoImportarPedidos() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const importarPedidos = async () => {
    setLoading(true);
    setSucesso(false);
    try {
      for (const pedido of pedidos) {
        await fetch("/api/pedidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedido),
        });
      }
      setSucesso(true);
    } catch (error) {
      console.error("Erro ao importar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex justify-center mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button onClick={importarPedidos} disabled={loading}>
        {loading ? "Importando..." : "Importar Pedidos JSON"}
      </Button>
      {sucesso && (
        <motion.span
          className="ml-4 text-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Pedidos importados!
        </motion.span>
      )}
    </motion.div>
  );
}
