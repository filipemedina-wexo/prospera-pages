
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Smartphone, Search, Globe2, MessageCircle } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Velocidade Extrema',
    description: 'Seu site no ar em 48h. Sem enrolação.'
  },
  {
    icon: Clock,
    title: 'Venda 24 Horas',
    description: 'Seu negócio vendendo mesmo quando você está offline.'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Design perfeito para celulares — onde 90% dos clientes estão.'
  },
  {
    icon: Search,
    title: 'Google Friendly',
    description: 'Otimizado para aparecer nas buscas locais.'
  },
  {
    icon: Globe2,
    title: 'Domínio Próprio',
    description: 'Nada de domínios amadores. Tenha um endereço profissional.'
  },
  {
    icon: MessageCircle,
    title: 'Botão WhatsApp',
    description: 'Link direto para seu chat. O cliente clica e já fala com você.'
  }
];

const Benefits = () => {
  const words = ["Crescer", "Vender", "Decolar", "Atrair Clientes", "Converter Mais", "Profissionalizar"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-6 bg-[#0F131F]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 flex flex-col md:block items-center justify-center gap-2">
            Tudo que você precisa para{' '}
            <div className="inline-block w-[280px] text-left relative h-[1.2em] align-top">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gradient absolute left-0 top-0 whitespace-nowrap"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h2>
          <p className="text-xl text-gray-400">
            Tecnologia de ponta simplificada para o seu negócio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-[#161b2c] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
