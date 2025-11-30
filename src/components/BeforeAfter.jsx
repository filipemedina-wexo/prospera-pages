
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const BeforeAfter = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-[#0F131F] to-[#0B0F19]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            A Evolução do Seu Negócio
          </h2>
          <p className="text-xl text-gray-400">
            Veja a diferença entre ser amador e ser profissional.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* ANTES */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#161b2c] border border-red-500/20 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <span className="inline-block px-4 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-bold uppercase mb-8">
                Modo Atual
              </span>
              
              <div className="space-y-6 mb-8">
                <img alt="Confused customer looking at phone" className="w-full h-48 object-cover rounded-xl opacity-60 grayscale" src="https://images.unsplash.com/photo-1571239982287-9a7a17c1b9c1" />
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    "Me passa o endereço?" (10x por dia)
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Cliente desiste de procurar
                  </li>
                  <li className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Sem credibilidade online
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* DEPOIS */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative bg-[#161b2c] border border-cyan-500/30 rounded-3xl p-8 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>
              <span className="inline-block px-4 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-bold uppercase mb-8">
                Modo Prospera
              </span>

              <div className="space-y-6 mb-8">
                <img alt="Sleek mobile landing page" className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/10" src="https://images.unsplash.com/photo-1579667410546-f7079afa0601" />
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    Tudo em um link só (Bio/WhatsApp)
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    Cliente chega pronto para pagar
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    Autoridade instantânea
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
