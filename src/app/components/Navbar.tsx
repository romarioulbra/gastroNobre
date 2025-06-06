'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiShoppingCart, FiClock, FiCoffee } from 'react-icons/fi'
import { GiCook, GiChefToque } from 'react-icons/gi'
import { RiRestaurantFill } from 'react-icons/ri'
import { NotificacaoMenu } from './NotificacaoMenu'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
      }}
            style={{
        background: 'linear-gradient(135deg, rgba(255,248,240,0.98) 0%, rgba(255,245,235,0.98) 50%, rgba(255,242,230,0.98) 100%)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 1px 12px -3px rgba(249,115,22,0.1)',
        borderBottom: '1px solid rgba(249,115,22,0.08)'
      }}
      className="w-full px-8 py-6 bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-100/50 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Logo Premium */}
      <Link 
        href="/" 
        className="flex flex-col items-center gap-1 group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200/50"
        >
          <RiRestaurantFill className="text-white text-3xl" />
        </motion.div>
        {/* <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold tracking-wider text-orange-600/90 group-hover:text-orange-700 transition-colors"
        >
          GASTRONOBRE
        </motion.span> */}
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold tracking-wider group-hover:text-opacity-100 transition-colors"
        >
        <span className="text-orange-600/90 group-hover:text-orange-700">GASTRO</span>
        <span className="text-black group-hover:text-slate-800">NOBRE</span>
      </motion.span>

      </Link>

      {/* Menu Premium */}
      <div className="flex gap-6">
        {[
          { href: "/", icon: <FiHome size={22} />, label: "Início" },
          { href: "/cliente", icon: <FiShoppingCart size={22} />, label: "Pedir" },
          { href: "/cozinha", icon: <GiChefToque size={22} />, label: "Cozinha" }
        ].map((item, index) => (
          <Link key={index} href={item.href} className="group">
            <motion.div
              whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-1 p-2"
            >
              <div className="p-2 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="text-orange-600 group-hover:text-orange-800 transition-colors"
                >
                  {item.icon}
                </motion.div>
              </div>
              <motion.span 
                className="text-xs font-medium text-gray-600 group-hover:text-orange-600 transition-colors"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1, fontWeight: 600 }}
              >
                {item.label}
              </motion.span>
            </motion.div>
          </Link>
        ))}
        <div >
          <NotificacaoMenu />
        </div>
        
      </div>
    </motion.nav>
  )
}

// 'use client'

// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { FiHome, FiShoppingCart } from 'react-icons/fi'
// import { GiChefToque } from 'react-icons/gi'
// import { RiRestaurantFill } from 'react-icons/ri'

// export default function Navbar() {
//   return (
//     <motion.nav
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ 
//         y: 0, 
//         opacity: 1,
//         transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
//       }}
//       className="w-full px-8 py-6 sticky top-0 z-50"
//       style={{
//         background: 'linear-gradient(135deg, rgba(255,248,240,0.98) 0%, rgba(255,245,235,0.98) 50%, rgba(255,242,230,0.98) 100%)',
//         backdropFilter: 'blur(8px)',
//         boxShadow: '0 1px 12px -3px rgba(249,115,22,0.1)',
//         borderBottom: '1px solid rgba(249,115,22,0.08)'
//       }}
//     >
//       {/* Logo Gourmet */}
//       <Link 
//         href="/" 
//         className="flex flex-col items-center gap-1 group relative"
//       >
//         <motion.div
//           whileHover={{ scale: 1.1, rotate: -5 }}
//           whileTap={{ scale: 0.95 }}
//           className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200/50 relative z-10"
//         >
//           <RiRestaurantFill className="text-white text-3xl" />
//         </motion.div>
//         <motion.div 
//           className="absolute -bottom-1 w-24 h-8 rounded-full bg-amber-100/40 blur-md group-hover:bg-amber-200/50 transition-all duration-300"
//           initial={{ opacity: 0.3 }}
//           whileHover={{ opacity: 0.6 }}
//         />
//         <motion.span 
//           className="text-xs font-semibold tracking-wider text-orange-600/90 group-hover:text-orange-700 transition-colors relative z-10 mt-1"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//         >
//           GASTRONOMIA
//         </motion.span>
//       </Link>

//       {/* Menu Gourmet */}
//       <div className="flex gap-6">
//         {[
//           { href: "/", icon: <FiHome size={22} />, label: "Início" },
//           { href: "/cliente", icon: <FiShoppingCart size={22} />, label: "Pedir" },
//           { href: "/cozinha", icon: <GiChefToque size={22} />, label: "Cozinha" }
//         ].map((item, index) => (
//           <Link key={index} href={item.href} className="group relative">
//             <motion.div
//               whileHover={{ y: -3 }}
//               className="flex flex-col items-center gap-1 p-2 relative z-10"
//             >
//               <div className="p-2 rounded-full bg-white/80 group-hover:bg-white transition-colors duration-300 shadow-sm">
//                 <motion.div
//                   whileHover={{ scale: 1.15 }}
//                   className="text-orange-600 group-hover:text-orange-700 transition-colors"
//                 >
//                   {item.icon}
//                 </motion.div>
//               </div>
//               <motion.span 
//                 className="text-xs font-medium text-gray-600 group-hover:text-orange-600 transition-colors"
//                 initial={{ opacity: 0.8 }}
//                 whileHover={{ opacity: 1, fontWeight: 600 }}
//               >
//                 {item.label}
//               </motion.span>
//             </motion.div>
//             <motion.div 
//               className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full bg-amber-100/30 blur-md group-hover:bg-amber-200/40 transition-all duration-300"
//               initial={{ opacity: 0 }}
//               whileHover={{ opacity: 0.5 }}
//             />
//           </Link>
//         ))}
//       </div>
//     </motion.nav>
//   )
// }