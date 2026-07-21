import React from 'react';
import { motion } from 'framer-motion';
import { Layout, MessageSquare, Search, Smartphone, FileText, Globe2 } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const items = [
  { title: 'Site profissional e responsivo', description: 'Uma presença digital clara, rápida e preparada para celular e computador.', icon: Layout },
  { title: 'Textos organizados', description: 'Conteúdo estruturado para explicar seu negócio sem deixar o cliente confuso.', icon: FileText },
  { title: 'WhatsApp e formulário', description: 'Canais diretos para o cliente tirar dúvidas e pedir um orçamento.', icon: MessageSquare },
  { title: 'Estrutura para buscas', description: 'Base organizada para Google e ferramentas de busca entenderem sua empresa.', icon: Search },
  { title: 'Publicação e hospedagem', description: 'Incluídas conforme o plano contratado e as condições comerciais apresentadas.', icon: Globe2 },
  { title: 'Feito para qualquer tela', description: 'Uma experiência consistente para quem chega pelo anúncio, Google ou Instagram.', icon: Smartphone },
];

const WhatYouReceive = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section id="what-you-receive" className="py-24 bg-white relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">O que você recebe?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">A Prospera cuida da estrutura, dos textos e da publicação para sua empresa começar com clareza.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map(({ title, description, icon: Icon }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6"><Icon className="text-teal-600" size={28} /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouReceive;
