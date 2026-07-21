import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackMetaEvent } from '@/lib/tracking';

const plans = [
  {
    name: 'Essencial',
    subtitle: 'Presença Digital Rápida',
    price: 'A partir de R$ 1.400',
    payment: 'Pagamento único ou parcelamento em até 12x, conforme condição comercial.',
    description: 'Para colocar seu negócio online com clareza e profissionalismo.',
    features: ['Página única profissional', 'Textos organizados', 'Botão WhatsApp e formulário', 'Design responsivo', 'Estrutura para buscas', 'Publicação e hospedagem conforme o plano', 'Entrega conforme prazo comercial confirmado'],
    accentClass: 'bg-teal-500',
  },
  {
    name: 'Site Completo',
    subtitle: 'Mais clareza, mais confiança',
    price: 'A partir de R$ 2.000',
    payment: 'Pagamento único ou parcelamento em até 12x, conforme condição comercial.',
    description: 'Para negócios que precisam explicar melhor serviços, produtos e diferenciais.',
    features: ['Tudo do Essencial', 'Mais seções e informações', 'Organização de serviços ou produtos', 'Jornada do cliente mais clara', 'Design mais elaborado', 'Publicação e hospedagem conforme o plano', 'Entrega conforme prazo comercial confirmado'],
    accentClass: 'bg-blue-500',
  },
  {
    name: 'Projetos Especiais',
    subtitle: 'Projeto sob medida',
    price: 'Valor sob consulta',
    payment: 'Condições de pagamento e prazo definidos após avaliação do projeto.',
    description: 'Para marcas que precisam de uma estrutura digital mais robusta.',
    features: ['Arquitetura completa de site', 'Múltiplas páginas', 'Catálogo avançado', 'Componentes interativos', 'Storytelling e organização estratégica', 'Estrutura pensada para evolução'],
    accentClass: 'bg-purple-500',
  },
];

const Pricing = ({ selectedPlan, setSelectedPlan }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (isInView) trackMetaEvent('ViewContent', { content_name: 'Planos Prospera', content_type: 'product' });
  }, [isInView]);

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase">Investimento no seu negócio</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-6">Planos claros para começar</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Veja o ponto de partida de cada solução. A condição final depende do escopo confirmado com você.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className={`relative bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border ${isSelected ? 'border-4 border-teal-500 ring-4 ring-teal-500/20' : 'border-slate-100'}`}>
                <div className={`h-2 ${plan.accentClass}`} />
                <div className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-teal-600 font-medium text-sm mt-2 mb-4">{plan.subtitle}</p>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">{plan.description}</p>
                  <p className="text-3xl font-extrabold text-slate-900">{plan.price}</p>
                  <p className="text-xs text-slate-500 mt-2 min-h-[36px]">{plan.payment}</p>
                  <ul className="space-y-3 my-8 flex-1">
                    {plan.features.map((feature) => <li key={feature} className="flex items-start gap-3"><Check className="flex-shrink-0 mt-0.5 text-teal-500" size={20} /><span className="text-slate-700 text-sm leading-relaxed">{feature}</span></li>)}
                  </ul>
                  <Button onClick={() => handleSelectPlan(plan.name)} className="w-full py-7 bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                    {isSelected ? 'Plano selecionado' : 'Quero este plano'} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
