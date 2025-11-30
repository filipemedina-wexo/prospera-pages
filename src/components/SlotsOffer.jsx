
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SlotsOffer = () => {
  const [takenSlots, setTakenSlots] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('prospera-slots');
    if (saved) {
      setTakenSlots(JSON.parse(saved));
    } else {
      const initial = Array(8).fill(0).map((_, i) => i);
      setTakenSlots(initial);
      localStorage.setItem('prospera-slots', JSON.stringify(initial));
    }
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-6 bg-[#0B0F19] border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1 bg-lime-500/10 text-lime-400 rounded-full text-sm font-bold uppercase mb-6">
            Oportunidade Exclusiva
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Apenas <span className="text-gradient-lime">20 Vagas</span> este mês
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Priorizamos a qualidade. Atendemos poucos clientes para garantir que sua página fique perfeita.
          </p>

          <div className="grid grid-cols-4 md:grid-cols-5 gap-3 max-w-3xl mx-auto mb-12">
            {Array(20).fill(0).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-lg font-bold relative overflow-hidden ${
                  takenSlots.includes(index)
                    ? 'bg-red-500/5 border border-red-500/20 text-red-500/50'
                    : 'bg-lime-500/10 border border-lime-500/30 text-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.2)]'
                }`}
              >
                {takenSlots.includes(index) ? (
                   <span className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-[1px]">
                     X
                   </span>
                ) : (
                  index + 1
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-8">
            <p className="text-2xl text-white">
              Restam apenas <span className="text-lime-400 font-bold text-3xl">{20 - takenSlots.length}</span> vagas
            </p>
            
            <button
              onClick={scrollToForm}
              className="btn-primary text-lg px-12 py-5 animate-pulse"
            >
              Garantir Minha Vaga Agora
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SlotsOffer;
