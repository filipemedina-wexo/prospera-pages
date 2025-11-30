
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Send, Lock } from 'lucide-react';

const businessTypes = [
  'Restaurante/Lanchonete',
  'Salão de Beleza/Barbearia',
  'Loja de Roupas',
  'Prestador de Serviços',
  'Consultório/Clínica',
  'Academia/Estúdio',
  'Pet Shop',
  'Outro'
];

const FinalCTA = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    city: '',
    whatsapp: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissions = JSON.parse(localStorage.getItem('prospera-submissions') || '[]');
    submissions.push({
      ...formData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('prospera-submissions', JSON.stringify(submissions));

    const currentSlots = JSON.parse(localStorage.getItem('prospera-slots') || '[]');
    if (currentSlots.length < 20) {
      currentSlots.push(currentSlots.length);
      localStorage.setItem('prospera-slots', JSON.stringify(currentSlots));
    }

    setSubmitted(true);
    toast({
      title: "Sucesso! 🎉",
      description: "Cadastro recebido. Vamos te chamar no WhatsApp em breve.",
    });
  };

  return (
    <section id="form-section" className="py-32 px-6 bg-[#0B0F19] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#161b2c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/50"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Sua Nova Fase Começa Agora
            </h2>
            <p className="text-gray-400">
              Preencha para garantir sua vaga promocional de <span className="text-white font-bold">R$ 500</span>.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Recebemos seu pedido!</h3>
              <p className="text-gray-400">Fique atento ao seu WhatsApp. Nossa equipe entrará em contato.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Seu Nome</label>
                   <input
                    type="text"
                    required
                    placeholder="João Silva"
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">WhatsApp</label>
                   <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                   />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-sm font-medium text-gray-300">Nome do Negócio</label>
                 <input
                  type="text"
                  required
                  placeholder="Ex: Pizzaria do João"
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                 />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Cidade</label>
                   <input
                    type="text"
                    required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-300">Tipo de Negócio</label>
                   <select
                    required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none"
                    value={formData.businessType}
                    onChange={e => setFormData({...formData, businessType: e.target.value})}
                   >
                     <option value="">Selecione...</option>
                     {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary text-lg py-5 mt-4">
                Garantir Minha Vaga
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                <Lock className="w-3 h-3" />
                <span>Seus dados estão seguros e não faremos spam.</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
