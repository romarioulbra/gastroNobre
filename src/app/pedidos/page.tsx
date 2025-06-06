// "use client";

// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import pedidos from "@/app/data/pedidos.json";
// import { useState } from "react";

// export function BotaoImportarPedidos() {
//   const [loading, setLoading] = useState(false);
//   const [sucesso, setSucesso] = useState(false);

//   const importarPedidos = async () => {
//     setLoading(true);
//     setSucesso(false);
//     try {
//       for (const pedido of pedidos) {
//         await fetch("/api/pedidos", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(pedido),
//         });
//       }
//       setSucesso(true);
//     } catch (error) {
//       console.error("Erro ao importar pedidos:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="flex justify-center mb-4"
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Button onClick={importarPedidos} disabled={loading}>
//         {loading ? "Importando..." : "Importar Pedidos JSON"}
//       </Button>
//       {sucesso && (
//         <motion.span
//           className="ml-4 text-green-500"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           ✅ Pedidos importados!
//         </motion.span>
//       )}
//     </motion.div>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import pedidosJson from "@/app/data/pedidos.json";
import { useState, useEffect } from "react";

export function BotaoImportarPedidos() {
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);

  const importarPedidos = async () => {
    setLoading(true);
    setSucesso(false);
    try {
      for (const pedido of pedidosJson) {
        await fetch("/api/pedidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pedido),
        });
      }
      setSucesso(true);
      await fetchPedidos();
    } catch (error) {
      console.error("Erro ao importar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidos = async () => {
    try {
      const res = await fetch("/api/pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        className="flex justify-center items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button onClick={importarPedidos} disabled={loading}>
          {loading ? "Importando..." : "Importar Pedidos JSON"}
        </Button>
        <Button variant="outline" onClick={fetchPedidos}>
          Atualizar
        </Button>
        {sucesso && (
          <motion.span
            className="text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✅ Pedidos importados!
          </motion.span>
        )}
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {pedidos.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido: any) => (
              <div
                key={pedido.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold">
                  Pedido de {pedido.cliente}
                </h2>
                <p>Mesa: {pedido.mesa}</p>
                <p>Itens: {pedido.itens?.join(", ")}</p>
                <p>Status: <span className="font-medium">{pedido.status}</span></p>

                {pedido.comprovanteUrl ? (
                  <a
                    href={pedido.comprovanteUrl}
                    target="_blank"
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    📄 Ver Comprovante
                  </a>
                ) : (
                  <p className="text-gray-400 mt-2">Comprovante ainda não disponível</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
