
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'O que eu preciso enviar?',
    answer: 'Apenas o básico: fotos do seu negócio/produtos, seu logotipo (se tiver), endereço, contatos e textos sobre o que você faz. Nós guiamos você em tudo.'
  },
  {
    question: 'Preciso pagar mensalidade?',
    answer: 'Os R$ 500 são pela criação. Para manter o site no ar (hospedagem + domínio), existe um custo anual pequeno de terceiros que ajudamos você a configurar.'
  },
  {
    question: 'Posso atualizar as informações depois?',
    answer: 'Sim! Se mudar de endereço ou telefone, nós atualizamos para você. Pequenos ajustes estão inclusos no nosso suporte.'
  },
  {
    question: 'Serve para o meu tipo de negócio?',
    answer: 'Se você vende produtos ou serviços e precisa que clientes te encontrem, SIM. Atendemos desde advogados e dentistas até lanchonetes e pet shops.'
  },
  {
    question: 'Quanto tempo demora?',
    answer: 'Após recebermos seu material, entregamos a primeira versão em até 48 horas úteis. É muito rápido.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 px-6 bg-[#0F131F]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Dúvidas Comuns</h2>
          <p className="text-gray-400">Não fique com dúvidas, entre em contato.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-white/5 rounded-2xl overflow-hidden bg-[#161b2c]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                <div className={`p-1 rounded-full ${openIndex === index ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                   {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-400 border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
