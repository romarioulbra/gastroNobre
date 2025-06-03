// 'use client'

// import { motion } from 'framer-motion'
// import { FiClock, FiStar, FiShoppingBag, FiMapPin } from 'react-icons/fi'
// import { GiMeal, GiChefToque, GiSaucepan, GiFruitBowl } from 'react-icons/gi'
// import { RiRestaurantFill, RiLeafLine } from 'react-icons/ri'
// import { IoFastFoodOutline } from 'react-icons/io5'

// export default function Home() {
//   return (
//     <div className="min-h-screen w-full" style={{
//       background: 'radial-gradient(circle at 50% 70%, rgba(255,248,240,1) 0%, rgba(255,245,235,1) 50%, rgba(255,242,230,1) 100%)'
//     }}>
//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0 opacity-10">
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full bg-amber-400"
//               initial={{ 
//                 scale: 0,
//                 opacity: 0,
//                 x: Math.random() * 100,
//                 y: Math.random() * 100,
//                 width: Math.random() * 100 + 50,
//                 height: Math.random() * 100 + 50
//               }}
//               animate={{ 
//                 scale: 1,
//                 opacity: [0, 0.2, 0],
//                 transition: { 
//                   duration: Math.random() * 10 + 10,
//                   repeat: Infinity,
//                   repeatType: "reverse",
//                   delay: Math.random() * 5
//                 }
//               }}
//             />
//           ))}
//         </div>

//         <div className="container mx-auto px-6 py-24 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-center"
//           >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="inline-block mb-6"
//             >
//               <RiRestaurantFill className="text-6xl text-amber-600 drop-shadow-lg" />
//             </motion.div>
            
//             <motion.h1 
//               className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               {/* Gastro Nobre */}
//                <span className="text-orange-600/90 group-hover:text-orange-700">GASTRO </span>
//         <span className="text-black group-hover:text-slate-800">NOBRE</span>
//             </motion.h1>
            
//             <motion.p 
//               className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               Descubra sabores extraordinários preparados com paixão pelos melhores chefs
//             </motion.p>
            
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.7 }}
//               className="flex justify-center gap-4"
//             >
//               <motion.button
//                 whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(249,115,22,0.2)' }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium shadow-lg shadow-amber-200/50"
//               >
//                 Faça seu pedido
//               </motion.button>
              
//               <motion.button
//                 whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.8)' }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-3 rounded-full bg-white/90 text-orange-600 font-medium border border-orange-100"
//               >
//                 Conheça o menu
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-white/50 backdrop-blur-sm">
//         <div className="container mx-auto px-6">
//           <motion.h2 
//             className="text-3xl font-bold text-center mb-16 text-gray-800"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.2 }}
//           >
//             Por que escolher nosso restaurante?
//           </motion.h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-white/90 p-8 rounded-2xl shadow-sm border border-orange-50 hover:border-orange-100 transition-all"
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2 + index * 0.1 }}
//                 whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(249,115,22,0.1)' }}
//               >
//                 <motion.div
//                   className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl"
//                   style={{
//                     background: 'linear-gradient(135deg, rgba(255,237,213,1) 0%, rgba(254,215,170,1) 100%)'
//                   }}
//                   whileHover={{ rotate: 5, scale: 1.1 }}
//                 >
//                   {feature.icon}
//                 </motion.div>
//                 <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Menu Preview */}
//       <section className="py-20" style={{
//         background: 'linear-gradient(180deg, rgba(255,248,240,1) 0%, rgba(255,255,255,1) 100%)'
//       }}>
//         <div className="container mx-auto px-6">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <motion.h2 
//               className="text-3xl font-bold mb-4 text-gray-800"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               Destaques do Menu
//             </motion.h2>
//             <motion.p
//               className="text-gray-600 max-w-2xl mx-auto"
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               Nossas criações mais premiadas pelos clientes
//             </motion.p>
//           </motion.div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {menuItems.map((item, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-white rounded-xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-md transition-all"
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2 + index * 0.1 }}
//                 whileHover={{ y: -5 }}
//               >
//                 <div className="h-48 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center">
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     className="text-6xl"
//                     style={{ color: item.color }}
//                   >
//                     {item.icon}
//                   </motion.div>
//                 </div>
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
//                     <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
//                       R$ {item.price}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mb-4">{item.description}</p>
//                   <div className="flex items-center text-amber-500">
//                     {[...Array(5)].map((_, i) => (
//                       <FiStar key={i} className={i < item.rating ? 'fill-current' : ''} />
//                     ))}
//                     <span className="text-gray-500 text-sm ml-2">({item.reviews})</span>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// const features = [
//   {
//     icon: <GiChefToque className="text-amber-600" />,
//     title: "Chefs Especialistas",
//     description: "Nossos chefs premiados trazem anos de experiência e paixão pela culinária de alta qualidade."
//   },
//   {
//     icon: <GiFruitBowl className="text-amber-600" />,
//     title: "Ingredientes Frescos",
//     description: "Utilizamos apenas ingredientes locais e sazonais, garantindo o máximo de sabor e qualidade."
//   },
//   {
//     icon: <FiClock className="text-amber-600" />,
//     title: "Entrega Rápida",
//     description: "Preparamos e entregamos seu pedido com velocidade sem comprometer a qualidade dos pratos."
//   }
// ]

// const menuItems = [
//   {
//     icon: <GiMeal />,
//     name: "Risoto de Cogumelos",
//     description: "Risoto cremoso com cogumelos silvestres, trufa branca e parmesão reggiano.",
//     price: "89,90",
//     rating: 4,
//     reviews: 124,
//     color: "#92400e"
//   },
//   {
//     icon: <GiSaucepan />,
//     name: "Bouillabaisse",
//     description: "Clássico sopa de frutos do mar provençal com peixes frescos do dia.",
//     price: "112,50",
//     rating: 5,
//     reviews: 89,
//     color: "#d97706"
//   },
//   {
//     icon: <RiLeafLine />,
//     name: "Salada Gourmet",
//     description: "Mix de folhas orgânicas, queijo de cabra, nozes e molho de framboesa.",
//     price: "49,90",
//     rating: 4,
//     reviews: 156,
//     color: "#65a30d"
//   }
// ]

'use client'

import { motion } from 'framer-motion'
import { FiClock, FiStar, FiShoppingBag, FiMapPin } from 'react-icons/fi'
import { GiMeal, GiChefToque, GiSaucepan, GiFruitBowl, GiChickenOven } from 'react-icons/gi'
import { RiRestaurantFill, RiLeafLine } from 'react-icons/ri'
import { IoFastFoodOutline } from 'react-icons/io5'

export default function Home() {
  return (
    <div className="min-h-screen w-full" style={{
      background: 'radial-gradient(circle at 50% 70%, rgba(255,248,240,1) 0%, rgba(255,245,235,1) 50%, rgba(255,242,230,1) 100%)'
    }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-400"
              initial={{ 
                scale: 0,
                opacity: 0,
                x: Math.random() * 100,
                y: Math.random() * 100,
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50
              }}
              animate={{ 
                scale: 1,
                opacity: [0, 0.2, 0],
                transition: { 
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 5
                }
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-6"
            >
              <RiRestaurantFill className="text-6xl text-amber-600 drop-shadow-lg" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-orange-600/90 group-hover:text-orange-700">GASTRO </span>
              <span className="text-black group-hover:text-slate-800">NOBRE</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Descubra sabores extraordinários preparados com paixão pelos melhores chefs
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-4"
            >
              <motion.button
                whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(249,115,22,0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium shadow-lg shadow-amber-200/50"
              >
                Faça seu pedido
              </motion.button>
              
              <motion.button
                whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white/90 text-orange-600 font-medium border border-orange-100"
              >
                Conheça o menu
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Por que escolher nosso restaurante?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/90 p-8 rounded-2xl shadow-sm border border-orange-50 hover:border-orange-100 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(249,115,22,0.1)' }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,237,213,1) 0%, rgba(254,215,170,1) 100%)'
                  }}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20" style={{
        background: 'linear-gradient(180deg, rgba(255,248,240,1) 0%, rgba(255,255,255,1) 100%)'
      }}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Destaques do Menu
            </motion.h2>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Nossas criações mais premiadas pelos clientes
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Alterado para lg:grid-cols-4 */}
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-6xl"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </motion.div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      R$ {item.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < item.rating ? 'fill-current' : ''} />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">({item.reviews})</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: <GiChefToque className="text-amber-600" />,
    title: "Chefs Especialistas",
    description: "Nossos chefs premiados trazem anos de experiência e paixão pela culinária de alta qualidade."
  },
  {
    icon: <GiFruitBowl className="text-amber-600" />,
    title: "Ingredientes Frescos",
    description: "Utilizamos apenas ingredientes locais e sazonais, garantindo o máximo de sabor e qualidade."
  },
  {
    icon: <FiClock className="text-amber-600" />,
    title: "Entrega Rápida",
    description: "Preparamos e entregamos seu pedido com velocidade sem comprometer a qualidade dos pratos."
  }
]

const menuItems = [
  {
    icon: <GiMeal />,
    name: "Risoto de Cogumelos",
    description: "Risoto cremoso com cogumelos silvestres, trufa branca e parmesão reggiano.",
    price: "89,90",
    rating: 4,
    reviews: 124,
    color: "#92400e"
  },
  {
    icon: <GiSaucepan />,
    name: "Bouillabaisse",
    description: "Clássico sopa de frutos do mar provençal com peixes frescos do dia.",
    price: "112,50",
    rating: 5,
    reviews: 89,
    color: "#d97706"
  },
  {
    icon: <RiLeafLine />,
    name: "Salada Gourmet",
    description: "Mix de folhas orgânicas, queijo de cabra, nozes e molho de framboesa.",
    price: "49,90",
    rating: 4,
    reviews: 156,
    color: "#65a30d"
  },
  {
    icon: <GiChickenOven />,
    name: "Frango à Parmegiana",
    description: "Filé de frango empanado, molho de tomate caseiro e queijo derretido.",
    price: "65,90",
    rating: 4,
    reviews: 210,
    color: "#b45309"
  }
]