'use client'
import { PedidoProvider } from '../context/PedidoContext'
import { PedidoForm } from '../components/PedidoForm'
import PedidoList from '../components/PedidoList'
import { motion } from 'framer-motion'

export default function Pedidos() {
  return (
    <PedidoProvider>
      <motion.div
        className="max-w-4xl mx-auto py-10 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Painel de Pedidos</h1> */}
        <div className='mb-24'>
          <PedidoForm />
        </div>
      </motion.div>
    </PedidoProvider>
  )
}
