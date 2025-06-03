// 'use client'

// import { motion, AnimatePresence } from 'framer-motion'
// import { FiAlertTriangle, FiX } from 'react-icons/fi'

// interface ModalExclusaoProps {
//   isOpen: boolean
//   onClose: () => void
//   onConfirm: () => void
//   titulo: string
//   mensagem: string
//   loading?: boolean
// }

// export function ModalExclusao({
//   isOpen,
//   onClose,
//   onConfirm,
//   titulo,
//   mensagem,
//   loading = false
// }: ModalExclusaoProps) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           key="backdrop"
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           onClick={onClose}
//         >
//           <motion.div
//             key="modal"
//             className="bg-white rounded-lg p-6 z-50 max-w-md w-full shadow-lg relative"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.8, opacity: 0 }}
//             onClick={e => e.stopPropagation()}
//           >
//             <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
//               <FiX />
//             </button>

//             <div className="flex items-center mb-4 text-red-600">
//               <FiAlertTriangle size={24} className="mr-2" />
//               <h2 className="text-lg font-semibold">{titulo}</h2>
//             </div>

//             <p className="text-sm text-gray-700 mb-6">{mensagem}</p>

//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//                 onClick={onClose}
//                 disabled={loading}
//               >
//                 Cancelar
//               </button>
//               <button
//                 className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
//                 onClick={onConfirm}
//                 disabled={loading}
//               >
//                 {loading ? 'Excluindo...' : 'Confirmar'}
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface ModalExclusaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  titulo: string
  mensagem: string
  loading?: boolean
}

export function ModalExclusao({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensagem,
  loading = false
}: ModalExclusaoProps) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (!isBrowser) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Backdrop com efeito de blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-40"
          />

          {/* Conteúdo do modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300"
                  >
                    <FiAlertTriangle size={20} />
                  </motion.div>
                  <div>
                    <motion.h3 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {titulo}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="mt-1 text-sm text-gray-600 dark:text-gray-300"
                    >
                      {mensagem}
                    </motion.p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* Rodapé com botões */}
              <motion.div 
                className="mt-6 flex justify-end gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiTrash2 size={16} />
                    </motion.span>
                  ) : (
                    <FiTrash2 size={16} />
                  )}
                  Confirmar
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}