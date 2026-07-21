import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { question: 'Eu preciso entender de tecnologia ou design?', answer: 'Não. Você nos conta sobre o seu negócio e a Prospera cuida da estrutura, dos textos, do layout e da publicação.' },
  { question: 'Quanto tempo demora para meu site ficar pronto?', answer: 'No Plano Essencial, a primeira versão é entregue para aprovação em até 3 dias úteis após o recebimento do material. Projetos maiores têm prazo definido conforme o escopo.' },
  { question: 'E se eu não gostar do resultado?', answer: 'Antes da publicação, você recebe uma prévia para revisar. Os ajustes previstos na proposta são feitos antes do seu aceite final.' },
  { question: 'Eu tenho que pagar mensalidade?', answer: 'O Plano Essencial tem pagamento pela criação e inclui 1 ano de hospedagem. Depois desse período, a renovação e o domínio seguem as condições vigentes do serviço.' },
  { question: 'Posso usar um domínio que já tenho?', answer: 'Sim. A equipe pode orientar a configuração do seu domínio existente na nova página.' },
  { question: 'Qual a diferença para Wix ou WordPress?', answer: 'Em vez de entregar apenas uma ferramenta, a Prospera cria a página para você, organiza as informações e orienta a publicação.' },
];

const FAQ = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState(null);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };

  return (
    <section id="faq" className="py-24 bg-slate-50" ref={ref}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Tira-dúvidas</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Perguntas frequentes</h2>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                {openIndex === index ? <Minus className="text-teal-500 flex-shrink-0" /> : <Plus className="text-slate-400 flex-shrink-0" />}
              </button>
              <AnimatePresence>{openIndex === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className="px-6 pb-6 text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100 pt-4">{faq.answer}</div></motion.div>}</AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
