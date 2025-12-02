
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, HelpCircle, Frown, Lightbulb, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "A Busca Frustrada",
    description: "Muitos empresários acreditam que só ter Instagram resolve. Não resolve. Sem uma página que centralize endereço, horários, produtos e serviços, o cliente não encontra nada — e simplesmente não compra.",
    image: <img alt="Person searching on phone looking confused" src="/images/realstory_frustrated_search_custom.jpg" />
  },
  {
    icon: HelpCircle,
    title: "O Caos das Perguntas",
    description: (
      <>
        Após rodar a internet inteira atrás do seu contato, o cliente tenta te achar no WhatsApp.
        <br />
        Ele precisa salvar teu número na mão, abrir a lista de contatos e só então mandar:
        <br />
        “Que horas fecha hoje?”
        <br />
        E você, cheio de coisas pra fazer, só vê a mensagem depois que já fechou.
      </>
    ),
    image: <img alt="Overwhelmed person with notifications" src="/images/realstory_overwhelmed_custom.jpg" />
  },
  {
    icon: Frown,
    title: "Perdendo Vendas",
    description: (
      <>
        Enquanto você responde um, outros três desistem pela demora e escolhem seus concorrentes.
        <br />
        Em um mês, isso vira uma perda enorme de faturamento.
        <br />
        Parece até que o cliente precisa provar que “merece” ser atendido… e acaba desistindo.
        <br />
        O pior: 90% das mensagens são dúvidas básicas que ele resolveria em segundos se tivesse um site claro e acessível.
      </>
    ),
    image: <img alt="Empty store or lost customer" src="/images/realstory_lost_sales_custom.jpg" />
  },
  {
    icon: Lightbulb,
    title: "A Solução Simples",
    description: (
      <>
        Criamos uma página única com tudo que importa: horários, produtos e serviços, fotos e informações essenciais.
        <br />
        Em um clique, o cliente vê seus diferenciais e já decide comprar.
        <br />
        E quando quiser ir até sua empresa, ele toca no botão de rota e chega sem erro. Simples assim.
      </>
    ),
    image: <img alt="Clean landing page design" src="/images/realstory_solution_custom.png" />
  },
  {
    icon: TrendingUp,
    title: "O Resultado Real",
    description: (
      <>
        Os clientes começaram a aparecer, as vendas voltaram a entrar e o negócio finalmente começou a fluir.
        <br />
        Com a página no ar, a empresa ganha ritmo, cresce e atrai clientes mais qualificados todos os dias.
      </>
    ),
    image: <img alt="Sales graph going up" src="/images/realstory_result_custom.png" />
  }
];

const RealStory = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Create a vertical parallax effect for the cards
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section className="py-24 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Connecting Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent md:-translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-cyan-400 font-semibold tracking-wider uppercase text-sm"
          >
            Baseado em fatos reais
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mt-4 mb-6"
          >
            De <span className="text-red-400 line-through decoration-red-400/50">Caos</span> para <span className="text-gradient">Controle</span>
          </motion.h2>
        </div>

        <div ref={targetRef} className="relative space-y-12 md:space-y-24">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-[#0B0F19] shadow-[0_0_10px_rgba(6,182,212,0.5)] md:-translate-x-1/2 z-20 mt-8 md:mt-0" />

                {/* Content Card */}
                <div className="flex-1 w-full pl-12 md:pl-0">
                  <div className="bg-[#131b2e] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group shadow-lg">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <span className="text-xs text-gray-500 font-mono">Passo {index + 1}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Image Card */}
                <div className="flex-1 w-full pl-12 md:pl-0">
                  <div className="aspect-video md:aspect-[3/2] rounded-2xl overflow-hidden bg-black/20 border border-white/5 shadow-xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-60" />
                    {step.image}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RealStory;
