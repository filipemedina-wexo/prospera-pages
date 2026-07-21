import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    window.scrollTo({ top: elementPosition + window.scrollY - headerOffset, behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white/30 z-10 backdrop-blur-[1px]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,184,166,0.15),_rgba(255,255,255,0)_50%),radial-gradient(circle_at_100%_0%,_rgba(99,102,241,0.15),_rgba(255,255,255,0)_50%),radial-gradient(circle_at_0%_100%,_rgba(236,72,153,0.15),_rgba(255,255,255,0)_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-50/40 via-transparent to-blue-50/40 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-green-50 border border-teal-100 rounded-full text-teal-700 font-semibold text-sm mb-6 shadow-sm">
                <Sparkles size={16} className="text-teal-500 animate-pulse" />
                Simples. Profissional. Feito para vender.
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-teal-800 to-slate-800 bg-clip-text text-transparent leading-[1.2] tracking-tight pb-4">
            PARE DE PERDER VENDAS POR NÃO SER ENCONTRADO.
              </h1>
              <p className="text-xl text-slate-600 mb-3 leading-relaxed">Seu site profissional em até 12x.</p>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">A Prospera cria, escreve e publica o site da sua empresa para você ser encontrado, entendido e escolhido.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button onClick={() => scrollToSection('form')} size="lg" className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white text-lg px-8 py-6 shadow-xl hover:shadow-teal-500/20 transition-all duration-300 rounded-full">
                  QUERO MEU SITE <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button onClick={() => scrollToSection('portfolio')} size="lg" variant="outline" className="w-full border-2 border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-white text-lg px-8 py-6 rounded-full bg-white/50 backdrop-blur-sm">
                  Ver exemplos
                </Button>
              </motion.div>
            </motion.div>

            <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-500">
              {['Preço justo', 'Entrega clara', 'Nós fazemos por você'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-teal-600">✓</span>{item}
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block h-[600px] w-full">
            <div className="absolute top-0 right-10 w-96 h-96 bg-gradient-to-br from-teal-200/40 to-green-100/40 rounded-full blur-3xl -z-10" />
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-4 left-4 right-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-10">
              <div className="h-8 bg-white/50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" /><div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <span className="ml-4 text-[10px] text-slate-400">suaempresa.useprospera.com.br</span>
              </div>
              <video src="/hero-video.mp4" className="w-full h-[520px] object-cover" autoPlay muted loop playsInline poster="/og-image.png" />
            </motion.div>
            <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-30 w-48">
              <div className="flex justify-between items-center mb-2"><span className="text-xs font-semibold text-slate-500">Presença online</span><span className="text-xs font-bold text-green-500">Ativa</span></div>
              <div className="flex items-end gap-1 h-12">{[4, 6, 5, 8, 10, 12].map((height, index) => <div key={index} className="w-full rounded-t-sm bg-teal-400" style={{ height: `${height * 4}px`, opacity: 0.35 + index * 0.1 }} />)}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
