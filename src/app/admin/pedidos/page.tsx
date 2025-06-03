import { PedidoForm } from "../../components/PedidoForm";
import PedidosAdmin from "../../components/PedidosAdmin";

export default function PaginaPedidosAdmin() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administração de Pedidos</h1>
      <PedidoForm />
      <PedidosAdmin />
    </div>
  );
}
