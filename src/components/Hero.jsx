
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
            <span className="text-sm text-gray-300 font-medium">Oferta por tempo limitado</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight"
          >
            Você está perdendo <span className="text-gradient">clientes</span> invisíveis.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Ninguém encontra as informações básicas do seu negócio. Transforme visitantes em clientes fiéis com uma presença profissional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button onClick={scrollToForm} className="btn-primary group flex items-center gap-3 text-lg">
              Garantir Vaga por R$ 500
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex flex-col items-start pl-4 border-l border-white/10">
              <p className="text-sm text-gray-400 line-through">De R$ 2.900</p>
              <p className="text-lime-400 font-bold">Economia de 82%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-8 pt-4"
          >
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] bg-gray-700 overflow-hidden">
                   <img alt="Small business owner portrait" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1632709878761-d4d0f5bdc2d8" />
                 </div>
               ))}
             </div>
             <div className="flex flex-col">
                <div className="flex text-yellow-400 gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-400">Mais de 200 negócios atendidos</p>
             </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/20">
            <img alt="Modern Landing Page Mockup on Laptop" className="w-full h-auto" src="https://images.unsplash.com/photo-1694840593025-87acec00bbe6" />
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 bg-[#161b2c] p-4 rounded-xl border border-white/10 shadow-xl z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <ArrowRight className="text-green-400 rotate-45" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Vendas</p>
              <p className="text-lg font-bold text-white">+42%</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
