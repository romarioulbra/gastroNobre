'use client'

import { FiBell } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNotificacoes } from '../context/NotificacaoContext'
import Link from 'next/link'

export function NotificacaoMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { notificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [prevUnreadCount, setPrevUnreadCount] = useState(0)

  const naoLidas = notificacoes.filter(n => !n.lida).length

  useEffect(() => {
    if (naoLidas > prevUnreadCount) {
      setHasNewNotification(true)
      const timer = setTimeout(() => setHasNewNotification(false), 3000)
      return () => clearTimeout(timer)
    }
    setPrevUnreadCount(naoLidas)
  }, [naoLidas, prevUnreadCount])

  return (
    <div className="group relative">
      <div className="flex flex-col items-center gap-1 p-2">
        <motion.button 
          onClick={() => {
            setIsOpen(!isOpen)
            setHasNewNotification(false)
          }}
          className="relative"
        >
          <motion.div
            animate={{
              color: hasNewNotification ? '#dc2626' : '#ea580c',
              scale: hasNewNotification ? [1, 1.2, 1] : 1,
              rotate: hasNewNotification ? [0, 10, -10, 0] : 0
            }}
            transition={{
              color: { duration: 0.3 },
              scale: { duration: 0.5 },
              rotate: { duration: 0.5 }
            }}
            className="p-2 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300"
          >
            <FiBell size={22} />
          </motion.div>
          
          {naoLidas > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                backgroundColor: hasNewNotification ? '#dc2626' : '#ef4444'
              }}
              transition={{ 
                backgroundColor: { duration: 0.3 },
                scale: { type: 'spring', stiffness: 500, damping: 20 }
              }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {naoLidas}
            </motion.span>
          )}
        </motion.button>
        <motion.span 
          className="text-xs font-medium text-gray-600 group-hover:text-orange-600 transition-colors"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, fontWeight: 600 }}
        >
          Notificações
        </motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-100 bg-orange-50">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-orange-800">Notificações</h3>
                {notificacoes.length > 0 && (
                  <button
                    onClick={marcarTodasComoLidas}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notificacoes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Nenhuma notificação
                </div>
              ) : (
                <ul>
                  {notificacoes.map((notificacao) => (
                    <motion.li
                      key={notificacao.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-gray-100 last:border-0 ${!notificacao.lida ? 'bg-orange-50/50' : ''}`}
                    >
                      <Link
                        href={notificacao.pedidoId ? `/pedidos?id=${notificacao.pedidoId}` : '#'}
                        onClick={() => marcarComoLida(notificacao.id)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors block"
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-sm ${notificacao.lida ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
                            {notificacao.mensagem}
                          </span>
                          {!notificacao.lida && (
                            <span className="inline-block h-2 w-2 rounded-full bg-orange-500 ml-2"></span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(notificacao.data).toLocaleTimeString()}
                          {notificacao.pedidoId && (
                            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-[0.7rem]">
                              Pedido #{notificacao.pedidoId}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
