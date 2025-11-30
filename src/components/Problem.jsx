
import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, SearchX, Clock, MapPinOff, Globe, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: SearchX,
    text: "Invisível no Google",
    subtext: "Seu cliente procura mas não te acha"
  },
  {
    icon: Clock,
    text: "Perda de Tempo",
    subtext: "Repetindo o endereço 20x ao dia"
  },
  {
    icon: DollarSign,
    text: "Vendas Perdidas",
    subtext: "Cliente desiste pela dificuldade"
  },
  {
    icon: Globe,
    text: "Sem Profissionalismo",
    subtext: "Apenas Instagram não passa confiança"
  },
  {
    icon: MapPinOff,
    text: "Localização Confusa",
    subtext: "Clientes se perdem ou não vão"
  },
  {
    icon: XCircle,
    text: "Sem Controle",
    subtext: "Dependendo do algoritmo das redes"
  }
];

const Problem = () => {
  return (
    <section className="py-24 px-6 bg-[#0F131F] relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sinais de que você precisa <span className="text-red-400">urgentemente</span> de um site
          </h2>
          <p className="text-xl text-gray-400">
            Se você se identifica com 2 ou mais itens, você está deixando dinheiro na mesa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start gap-4 bg-red-500/5 border border-red-500/10 rounded-2xl p-6 hover:bg-red-500/10 transition-colors cursor-default group"
            >
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{item.text}</h3>
                <p className="text-sm text-gray-400">{item.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
