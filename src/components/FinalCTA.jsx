import React, { useState, useEffect } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    if (submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} minutos e ${s} segundos`;
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) {
      setFormData({ ...formData, whatsapp: formatted });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('https://prospera-n8n.34eiwn.easypanel.host/webhook/a9d3545d-ad29-486b-9188-331f4e04359a', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ...formData,
          timestamp: new Date().toISOString()
        }).toString(),
      });

      setSubmitted(true);
      toast({
        title: "Sucesso! 🎉",
        description: "Cadastro recebido. Vamos te chamar no WhatsApp em breve.",
      });

      const currentSlots = JSON.parse(localStorage.getItem('prospera-slots') || '[]');
      if (currentSlots.length < 20) {
        currentSlots.push(currentSlots.length);
        localStorage.setItem('prospera-slots', JSON.stringify(currentSlots));
      }

    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    }
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
          {!submitted && (
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Sua nova fase começa agora.
              </h2>
              <p className="text-gray-400">
                Garanta sua vaga promocional de <span className="text-white font-bold">R$ 500</span>.
              </p>
            </div>
          )}

          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-mono text-lg font-bold border border-red-500/20">
                  Esta oferta expira em {formatTime(timeLeft)}
                </span>
              </div>

              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Obrigado! Agora finalize sua vaga com o pagamento.
              </h3>

              <div className="space-y-2 text-gray-400 mb-8">
                <p>Só iniciamos a produção após a confirmação.</p>
                <p>Vagas limitadas — garanta a sua agora.</p>
              </div>

              <a
                href="https://www.asaas.com/c/41zbzi5vgxh0b50n"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-green-500/20 ${timeLeft === 0 ? 'animate-pulse' : ''}`}
              >
                Pagar R$ 500 e confirmar minha vaga
              </a>

              <div className="mt-8 space-y-1 text-sm text-gray-500">
                <p>Restam poucas vagas este mês.</p>
                <p>Seu lugar só fica reservado após o pagamento.</p>
              </div>
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
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
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
                    onChange={handlePhoneChange}
                    maxLength={15}
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
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
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
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Tipo de Negócio</label>
                  <select
                    required
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all appearance-none"
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
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
