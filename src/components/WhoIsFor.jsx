
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

const WhoIsFor = () => {
  return (
    <section className="py-32 px-6 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-20">
          Para quem é a <span className="text-white">Prospera?</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Perfeito para Você</h3>
            </div>
            <ul className="space-y-4">
              {[
                'Negócios locais (Restaurantes, Lojas, Clínicas)',
                'Prestadores de serviços autônomos',
                'Quem vende pelo WhatsApp/Instagram',
                'Quem quer profissionalizar o atendimento'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-gradient-to-b from-red-500/10 to-red-500/5 border border-red-500/20"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-red-500/20 text-red-400">
                <XCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Não é para Você</h3>
            </div>
            <ul className="space-y-4">
              {[
                'E-commerces complexos com 1000 produtos',
                'Grandes corporações com setor de TI',
                'Quem busca soluções "de graça" e ruins',
                'Quem não quer investir no crescimento'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsFor;
