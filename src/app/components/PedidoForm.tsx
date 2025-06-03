'use client'

import { usePedidoContext } from '../context/PedidoContext'
import { useState, useRef, useEffect } from 'react'
import { FiSend, FiPlus, FiTrash2, FiCheck, FiUser, FiCoffee, FiHash } from 'react-icons/fi'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

export function PedidoForm() {
  const { adicionarPedido } = usePedidoContext()
  const [formData, setFormData] = useState({
    cliente: '',
    mesa: '',
    novoItem: ''
  })
  const [itens, setItens] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const controls = useAnimation()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    })
  }, [controls])

  const handleAddItem = () => {
    if (formData.novoItem.trim()) {
      setItens([...itens, formData.novoItem.trim()])
      setFormData({ ...formData, novoItem: '' })
      setErrors({ ...errors, itens: '' })
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...itens]
    newItems.splice(index, 1)
    setItens(newItems)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'Nome do cliente é obrigatório'
    } else if (formData.cliente.trim().length < 3) {
      newErrors.cliente = 'Nome muito curto'
    }

    if (!formData.mesa) {
      newErrors.mesa = 'Número da mesa é obrigatório'
    } else if (isNaN(Number(formData.mesa))) {
      newErrors.mesa = 'Digite um número válido'
    } else if (Number(formData.mesa) <= 0) {
      newErrors.mesa = 'Número inválido'
    }

    if (itens.length === 0) {
      newErrors.itens = 'Adicione pelo menos 1 item'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        await controls.start({
          scale: 0.98,
          transition: { duration: 0.2 }
        })

        // Envia para a API
        const response = await fetch('/api/pedidos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cliente: formData.cliente.trim(),
            mesa: Number(formData.mesa),
            itens
          })
        })

        if (!response.ok) {
          throw new Error('Erro ao enviar pedido')
        }

        const data = await response.json()

        // Atualiza o contexto local
        // adicionarPedido({
        //   cliente: formData.cliente.trim(),
        //   mesa: Number(formData.mesa),
        //   itens,
        //   id: data.id,
        //   status: data.status,
        //   createdAt: data.createdAt
        // })

        await controls.start({
          x: [0, 10, -10, 10, -5, 5, 0],
          transition: { duration: 0.6 }
        })

        setFormData({ cliente: '', mesa: '', novoItem: '' })
        setItens([])
        setErrors({})
        setShowSuccess(true)

        // Esconde o toast após 5 segundos
        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)

        if (formRef.current) {
          formRef.current.reset()
        }

      } catch (error) {
        console.error('Erro:', error)
        setErrors({ submit: 'Erro ao enviar pedido. Tente novamente.' })
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.03 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-2xl mx-auto mt-12"
    >
      <motion.div
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        whileHover={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-amber-500 to-orange-500 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white flex items-center gap-3"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FiCoffee className="text-white text-2xl" />
            Painel de Pedidos
          </motion.h2>
          <motion.p 
            className="text-amber-100 mt-2 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Novo Pedido - Preencha os detalhes do pedido
          </motion.p>
        </motion.div>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
          animate={controls}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700 flex items-center gap-3">
                <FiUser size={18} /> Nome do Cliente
              </label>
              <input
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                placeholder="Ex: João da Silva"
                className="w-full h-14 text-lg px-5 py-4 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition shadow-sm"
              />
              {errors.cliente && (
                <motion.p 
                  className="text-red-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.cliente}
                </motion.p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700 flex items-center gap-3">
                <FiHash size={18} /> Mesa
              </label>
              <input
                value={formData.mesa}
                onChange={(e) => setFormData({ ...formData, mesa: e.target.value })}
                placeholder="Número da mesa"
                type="number"
                className="w-full h-14 text-lg px-5 py-4 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition shadow-sm"
              />
              {errors.mesa && (
                <motion.p 
                  className="text-red-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.mesa}
                </motion.p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Itens do Pedido</h3>
            
            <div className="flex gap-3">
              <input
                value={formData.novoItem}
                onChange={(e) => setFormData({ ...formData, novoItem: e.target.value })}
                placeholder="Adicionar item"
                className="flex-1 h-14 text-lg px-5 py-4 border border-gray-300 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
              />
              <motion.button
                type="button"
                onClick={handleAddItem}
                className="bg-amber-600 hover:bg-amber-700 text-white h-14 px-5 rounded-xl flex items-center justify-center text-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FiPlus size={22} />
              </motion.button>
            </div>
            
            {errors.itens && (
              <motion.p 
                className="text-red-500 text-sm"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.itens}
              </motion.p>
            )}

            <motion.div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
              <AnimatePresence>
                {itens.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between bg-gray-50 px-5 py-3 rounded-lg border border-gray-200"
                  >
                    <span className="text-gray-800 text-lg">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {errors.submit && (
            <motion.p 
              className="text-red-500 text-sm text-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.submit}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold text-lg flex items-center justify-center gap-3 px-8 py-4 rounded-xl shadow-md transition"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FiSend size={22} /> Enviar Pedido
          </motion.button>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3 text-lg"
          >
            <FiCheck className="text-2xl" />
            <span>Pedido enviado com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}