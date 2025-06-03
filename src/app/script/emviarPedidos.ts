import pedidos from "./pedidos.json";
import fetch from "node-fetch";


async function enviarPedidos() {
  for (const pedido of pedidos) {
    const res = await fetch("http://localhost:3000/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    const data = await res.json();
    console.log(`✅ Pedido de ${pedido.cliente} enviado:`, data);
  }
}

enviarPedidos();
