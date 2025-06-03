// 'use client'

// import { motion } from 'framer-motion'
// import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-t from-orange-50 via-amber-50 to-white pt-16 pb-8 border-t border-orange-100 mt-20">
//       <div className="container mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 text-gray-700">
//           {/* Branding */}
//           <div>
//             <h2 className="text-2xl font-bold mb-4">
//               <span className="text-orange-600">GASTRO</span>
//               <span className="text-yellow-800">NOBRE</span>
//             </h2>
//             <p className="text-sm leading-relaxed">
//               Uma jornada gastronômica de sabores autênticos, ingredientes frescos e experiências memoráveis.
//             </p>
//           </div>

//           {/* Contato */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-gray-800">Contato</h3>
//             <ul className="space-y-2 text-sm">
//               <li className="flex items-center gap-2">
//                 <FiMapPin className="text-orange-500" /> Rua dos Sabores, 123 – São Paulo, SP
//               </li>
//               <li className="flex items-center gap-2">
//                 <FiPhone className="text-orange-500" /> (11) 99999-0000
//               </li>
//               <li className="flex items-center gap-2">
//                 <FiMail className="text-orange-500" /> contato@gastronobre.com
//               </li>
//             </ul>
//           </div>

//           {/* Redes sociais */}
//           <div>
//             <h3 className="text-lg font-semibold mb-3 text-gray-800">Siga-nos</h3>
//             <div className="flex gap-4">
//               <motion.a
//                 href="#"
//                 whileHover={{ scale: 1.1 }}
//                 className="text-orange-600 hover:text-orange-800 transition-colors"
//               >
//                 <FiInstagram size={24} />
//               </motion.a>
//               <motion.a
//                 href="#"
//                 whileHover={{ scale: 1.1 }}
//                 className="text-orange-600 hover:text-orange-800 transition-colors"
//               >
//                 <FiFacebook size={24} />
//               </motion.a>
//             </div>
//           </div>
//         </div>

//         {/* Linha final */}
//         <div className="border-t border-orange-100 pt-6 text-center text-sm text-gray-500">
//           © {new Date().getFullYear()} Gastronobre. Todos os direitos reservados.
//         </div>
//       </div>
//     </footer>
//   )
// }



// 'use client'

// import { FiInstagram, FiFacebook, FiMail, FiPhone } from 'react-icons/fi'
// import { RiRestaurantFill } from 'react-icons/ri'

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-tr from-amber-900 to-amber-800 text-white pt-12 pb-8 px-6 mt-20">
//       <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
//         {/* Brand */}
//         <div>
//           <div className="flex items-center gap-2 mb-4">
//             <RiRestaurantFill className="text-3xl text-amber-400" />
//             <h2 className="text-xl font-semibold">Gastrô Elegance</h2>
//           </div>
//           <p className="text-sm text-amber-100">
//             Sabores únicos preparados com maestria por nossos chefs premiados. Uma experiência gastronômica memorável.
//           </p>
//         </div>

//         {/* Links úteis */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4 text-amber-300">Links Úteis</h3>
//           <ul className="space-y-2 text-sm">
//             <li><a href="#" className="hover:underline text-amber-100">Início</a></li>
//             <li><a href="#" className="hover:underline text-amber-100">Menu</a></li>
//             <li><a href="#" className="hover:underline text-amber-100">Sobre</a></li>
//             <li><a href="#" className="hover:underline text-amber-100">Contato</a></li>
//           </ul>
//         </div>

//         {/* Contato */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4 text-amber-300">Contato</h3>
//           <ul className="space-y-3 text-sm text-amber-100">
//             <li className="flex items-center gap-2"><FiPhone /> (11) 1234-5678</li>
//             <li className="flex items-center gap-2"><FiMail /> contato@gastroelegance.com</li>
//             <li className="flex items-center gap-2"><FiInstagram /> @gastroelegance</li>
//             <li className="flex items-center gap-2"><FiFacebook /> facebook.com/gastroelegance</li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom line */}
//       <div className="border-t border-amber-700 mt-10 pt-6 text-center text-sm text-amber-200">
//         &copy; {new Date().getFullYear()} Gastrô Elegance. Todos os direitos reservados.
//       </div>
//     </footer>
//   )
// }


'use client'

import { motion } from 'framer-motion'
import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin,FiTwitter } from 'react-icons/fi'
import { RiRestaurantLine } from 'react-icons/ri'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 text-white pt-16 pb-10 mt-20 shadow-inner">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10"
        >
          {/* Branding */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <RiRestaurantLine className="text-3xl text-amber-300" />
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="text-orange-400">GASTRO</span>
                <span className="text-amber-100">NOBRE</span>
              </h2>
            </motion.div>
            <p className="text-sm text-amber-100">
              Uma jornada gastronômica de sabores autênticos, ingredientes frescos e experiências memoráveis.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-200">Contato</h3>
            <ul className="space-y-3 text-sm text-amber-100">
              <li className="flex items-center gap-2">
                <FiMapPin className="text-orange-400" /> Rua dos Sabores, 123 – São Paulo, SP
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-orange-400" /> (11) 99999-0000
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-orange-400" /> contato@gastronobre.com
              </li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-200">Siga-nos</h3>
            <div className="flex gap-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: -5 }}
                className="text-orange-400 hover:text-orange-300 transition-all"
              >
                <FiInstagram size={28} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-orange-400 hover:text-orange-300 transition-all"
              >
                <FiFacebook size={28} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-orange-400 hover:text-orange-300 transition-all"
              >
                <FiTwitter size={28} />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Linha final */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-amber-700 pt-6 text-center text-sm text-amber-200"
        >
          © {new Date().getFullYear()} Gastronobre. Todos os direitos reservados.
        </motion.div>
      </div>
    </footer>
  )
}
