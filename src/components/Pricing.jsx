import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Essencial',
    subtitle: 'Presença Digital Rápida',
    price: 'A partir de R$ 900',
    frequency: 'Pagamento único',
    description: 'Ideal para quem está começando ou precisa colocar o negócio online de forma clara e profissional.',
    features: [
      'Página única profissional (LP)',
      'Estrutura simples e objetiva',
      'Conteúdo essencial do negócio',
      'Botão WhatsApp flutuante',
      'Formulário de contato',
      'Design responsivo (celular e computador)',
      'Hospedagem inclusa (1º ano)',
      'Entrega em até 3 dias úteis',
    ],
    note: {
      text: 'Resolve 80% das necessidades da maioria dos pequenos negócios.',
    },
    cta: '👉 Quero minha página pronta',
    popular: false,
    blobColor: 'bg-teal-400',
    colorTheme: 'teal',
  },
  {
    name: 'Site Completo',
    subtitle: 'Mais clareza, mais confiança',
    price: 'A partir de R$ 1.400',
    frequency: 'Pagamento único',
    description: 'Para negócios que precisam explicar melhor o que fazem e transmitir mais credibilidade aos clientes.',
    features: [
      'Inclui tudo do Essencial +',
      'Estrutura mais rica e detalhada',
      'Mais seções e informações',
      'Melhor organização de serviços ou produtos',
      'Jornada do cliente mais clara',
      'Design mais elaborado',
      'Experiência de navegação mais completa',
    ],
    note: {
      text: 'Ideal para quem sente que uma página simples já não é suficiente.',
    },
    cta: '👉 Quero uma página mais completa',
    popular: false,
    blobColor: 'bg-blue-400',
    colorTheme: 'blue',
  },
  {
    name: 'Projetos Especiais',
    subtitle: 'Projeto sob medida',
    price: 'Valor sob consulta',
    frequency: '',
    description: 'Para marcas que precisam se posicionar, transmitir valor e crescer com uma estrutura digital mais robusta.',
    features: [
      'Arquitetura completa de site',
      'Múltiplas páginas e hierarquia de conteúdo',
      'Catálogo avançado de produtos ou serviços',
      'Componentes interativos',
      'Storytelling e organização estratégica',
      'Estrutura pensada para evolução do negócio',
    ],
    note: {
      text: 'Projetos mais complexos são avaliados junto com você, para manter o investimento justo e transparente.',
    },
    cta: '👉 Quero conversar sobre meu projeto',
    popular: false,
    blobColor: 'bg-purple-400',
    colorTheme: 'purple',
  },
];

const Pricing = ({ selectedPlan, setSelectedPlan }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (planName) => {
    setSelectedPlan(planName);
    scrollToSection('form');
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase mb-3 block">
            Investimento no seu sucesso
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Preços
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sem mensalidades ocultas ou “aluguel” de software.<br />
            Você investe na construção de um ativo digital seu, feito sob medida pela Prospera.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.name;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${isSelected
                  ? 'border-4 border-teal-500 ring-4 ring-teal-500/20 transform scale-105 z-10'
                  : plan.popular
                    ? 'border-2 border-blue-500 transform scale-105 z-10'
                    : 'border border-slate-100'
                  }`}
              >
                {/* Animated Background Blob */}
                <motion.div
                  className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none ${plan.blobColor}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none ${plan.blobColor}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 2,
                  }}
                />

                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-blue-500 text-white text-center py-1 text-sm font-bold uppercase tracking-wider z-20">
                    Recomendado
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-0 inset-x-0 bg-teal-500 text-white text-center py-1 text-sm font-bold uppercase tracking-wider z-20">
                    Selecionado
                  </div>
                )}

                <div className="p-8 flex flex-col h-full relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  </div>
                  <p className="text-teal-600 font-medium text-sm mb-4">{plan.subtitle}</p>
                  <p className="text-slate-500 mb-6 text-sm min-h-[40px] leading-relaxed">{plan.description}</p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 bg-clip-text">
                        {plan.price}
                      </span>
                    </div>
                    {plan.frequency && <span className="text-xs text-slate-400 block mt-1">{plan.frequency}</span>}
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="flex-shrink-0 mt-0.5 text-teal-500" size={20} />
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.note && (
                    <div className="mb-6 p-4 rounded-lg bg-slate-50/50 border border-slate-100 text-xs">
                      <span className="text-slate-500">{plan.note.text}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-100">
                    <Button
                      onClick={() => handleSelectPlan(plan.name)}
                      className={`w-full py-7 text-sm font-bold rounded-xl transition-all duration-300 group ${isSelected
                        ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 ring-2 ring-teal-500 ring-offset-2'
                        : plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                    >
                      {isSelected ? "Plano Selecionado" : "Selecionar Plano"}
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border border-teal-100">
            <Star size={16} fill="currentColor" />
            Garantia de Satisfação: Inclui uma revisão completa para ajustes finais após a aprovação da prévia.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
