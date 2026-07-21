import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Check, Send, Sparkles, User, Briefcase, FileText, MessageCircle, Rocket, Layers, Lock } from 'lucide-react';
import { getCampaignParams, trackMetaEvent } from '@/lib/tracking';

const WizardContact = ({ selectedPlan, selectedUpgrades }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        companyName: '',
        segment: '',
        goal: '',
        selectedPlan: '',
        selectedUpgrades: [],
    });
    const [ref, isInView] = useInView({ threshold: 0.1 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Máscara para telefone: (XX) XXXXX-XXXX
    const formatPhone = (value) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');

        // Limita a 11 dígitos
        const limited = numbers.slice(0, 11);

        // Aplica a máscara
        if (limited.length <= 2) {
            return limited.length > 0 ? `(${limited}` : '';
        } else if (limited.length <= 7) {
            return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        } else {
            return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'whatsapp') {
            setFormData({ ...formData, [name]: formatPhone(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // Validação do step 1
    const isStep1Valid = () => {
        const hasName = formData.name.trim().length > 0;
        const hasValidWhatsapp = formData.whatsapp.replace(/\D/g, '').length >= 10;
        const hasCompanyName = formData.companyName.trim().length > 0;
        return hasName && hasValidWhatsapp && hasCompanyName;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        setSubmitError('');

        const webhookUrl = 'https://prospera-n8n.34eiwn.easypanel.host/webhook/a9d3545d-ad29-486b-9188-331f4e04359a';

        const payload = {
            nome: formData.name,
            whatsapp: formData.whatsapp,
            empresa: formData.companyName,
            segmento: formData.segment,
            objetivo: formData.goal,
            plano: formData.selectedPlan || selectedPlan || 'Não selecionado',
            upgrades: formData.selectedUpgrades?.length > 0
                ? formData.selectedUpgrades.join(', ')
                : selectedUpgrades?.join(', ') || 'Nenhum',
            dataEnvio: new Date().toISOString(),
            origem: 'landing-page-prospera',
            ...getCampaignParams(),
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Webhook respondeu ${response.status}`);

            trackMetaEvent('Lead', { content_name: 'Formulário Prospera', content_category: 'lead' });
            nextStep();
        } catch (error) {
            console.error('Erro ao enviar lead:', error);
            setSubmitError('Não conseguimos enviar seus dados agora. Confira sua conexão e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (step / 3) * 100;

    return (
        <section id="form" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" ref={ref}>
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-bold border border-teal-200 mb-6">
                        <Sparkles size={14} />
                        Vamos começar?
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Tire seu projeto do papel hoje
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Preencha o formulário abaixo. É rápido e sem compromisso. Nossa equipe vai analisar e entrar em contato.
                    </p>
                </motion.div>

                <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-100 w-full relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-teal-400 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">1</div>
                                            <h3 className="text-2xl font-bold text-slate-800">Sobre Você</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-base font-semibold text-slate-700">Seu Nome</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="Ex: Maria Silva"
                                                        className={`pl-10 h-12 text-lg bg-slate-50 focus:border-teal-500 focus:ring-teal-500 ${!formData.name.trim() ? 'border-red-300' : 'border-slate-200'}`}
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="whatsapp" className="text-base font-semibold text-slate-700">Seu WhatsApp</Label>
                                                <div className="relative">
                                                    <MessageCircle className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <Input
                                                        id="whatsapp"
                                                        name="whatsapp"
                                                        placeholder="(11) 99999-9999"
                                                        className={`pl-10 h-12 text-lg bg-slate-50 focus:border-teal-500 focus:ring-teal-500 ${formData.whatsapp.replace(/\D/g, '').length < 10 ? 'border-red-300' : 'border-slate-200'}`}
                                                        value={formData.whatsapp}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName" className="text-base font-semibold text-slate-700">Nome da sua Empresa</Label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <Input
                                                        id="companyName"
                                                        name="companyName"
                                                        placeholder="Ex: Maria Bolos, Loja do João..."
                                                        className={`pl-10 h-12 text-lg bg-slate-50 focus:border-teal-500 focus:ring-teal-500 ${!formData.companyName.trim() ? 'border-red-300' : 'border-slate-200'}`}
                                                        value={formData.companyName}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="segment" className="text-base font-semibold text-slate-700">Ramo de Atuação</Label>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                                    <Input
                                                        id="segment"
                                                        name="segment"
                                                        placeholder="Ex: Advocacia, Pizzaria, Clínica..."
                                                        className="pl-10 h-12 text-lg bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                                                        value={formData.segment}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                size="lg"
                                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!isStep1Valid()}
                                            >
                                                Próximo Passo <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">2</div>
                                            <h3 className="text-2xl font-bold text-slate-800">Sobre o Projeto</h3>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="goal" className="text-base font-semibold text-slate-700">Qual o objetivo principal do site?</Label>
                                            <Textarea
                                                id="goal"
                                                name="goal"
                                                placeholder="Ex: Quero vender mais marmitas, quero que as pessoas agendem consulta, quero mostrar meu portfólio..."
                                                className="min-h-[100px] text-lg bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500 resize-none p-4"
                                                value={formData.goal}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold text-slate-700 block">Qual plano te interessa?</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, selectedPlan: 'Essencial' })}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.selectedPlan === 'Essencial' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    <span className="font-bold block mb-1">Essencial</span>
                                                    <span className="text-xs">A partir de R$ 1.400 • Página única</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, selectedPlan: 'Site Completo' })}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.selectedPlan === 'Site Completo' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    <span className="font-bold block mb-1">Site Completo</span>
                                                    <span className="text-xs">A partir de R$ 2.000</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, selectedPlan: 'Projeto Especial' })}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.selectedPlan === 'Projeto Especial' ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    <span className="font-bold block mb-1">Projeto Especial</span>
                                                    <span className="text-xs">Sob consulta</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label className="text-base font-semibold text-slate-700 block">Upgrades de interesse (opcional)</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {[
                                                    { name: 'Domínio Próprio', desc: 'suaempresa.com.br' },
                                                    { name: 'Chatbot Inteligente', desc: 'Atendimento 24h' },
                                                    { name: 'Catálogo Avançado', desc: 'Filtros e busca' }
                                                ].map((upgrade) => {
                                                    const isSelected = formData.selectedUpgrades?.includes(upgrade.name);
                                                    return (
                                                        <button
                                                            key={upgrade.name}
                                                            type="button"
                                                            onClick={() => {
                                                                const current = formData.selectedUpgrades || [];
                                                                if (isSelected) {
                                                                    setFormData({ ...formData, selectedUpgrades: current.filter(u => u !== upgrade.name) });
                                                                } else {
                                                                    setFormData({ ...formData, selectedUpgrades: [...current, upgrade.name] });
                                                                }
                                                            }}
                                                            className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                        >
                                                            <span className="font-bold block mb-1">{upgrade.name}</span>
                                                            <span className="text-xs">{upgrade.desc}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <Button type="button" onClick={prevStep} variant="ghost" className="text-slate-500 hover:text-slate-800">
                                                Voltar
                                            </Button>
                                            <Button type="button" onClick={nextStep} size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8">
                                                Revisar e Enviar <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">3</div>
                                            <h3 className="text-2xl font-bold text-slate-800">Pronto para Prosperar?</h3>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                            <h4 className="font-bold text-slate-700 mb-4">Resumo do seu pedido:</h4>
                                            <ul className="space-y-3">
                                                <li className="flex gap-2 text-slate-600">
                                                    <User size={18} className="text-teal-500 mt-0.5" />
                                                    <span className="font-semibold">{formData.name}</span>
                                                </li>
                                                <li className="flex gap-2 text-slate-600">
                                                    <MessageCircle size={18} className="text-teal-500 mt-0.5" />
                                                    {formData.whatsapp}
                                                </li>
                                                <li className="flex gap-2 text-slate-600">
                                                    <Briefcase size={18} className="text-teal-500 mt-0.5" />
                                                    {formData.companyName || formData.name} ({formData.segment || "Não informado"})
                                                </li>
                                                <li className="flex gap-2 text-slate-600">
                                                    <FileText size={18} className="text-teal-500 mt-0.5" />
                                                    Objetivo: {formData.goal || "Vender mais online"}
                                                </li>
                                                {/* Selected Plan */}
                                                <li className="flex gap-2 text-slate-600 pt-2 border-t border-slate-100 mt-2">
                                                    <Rocket size={18} className="text-blue-500 mt-0.5" />
                                                    Plano: <span className="font-bold text-slate-800">{formData.selectedPlan || selectedPlan || "Nenhum selecionado"}</span>
                                                </li>
                                                {/* Selected Upgrades */}
                                                {(formData.selectedUpgrades?.length > 0 || selectedUpgrades?.length > 0) && (
                                                    <li className="flex gap-2 text-slate-600">
                                                        <Layers size={18} className="text-purple-500 mt-0.5" />
                                                        Upgrades: <span className="font-medium text-slate-700">{(formData.selectedUpgrades?.length > 0 ? formData.selectedUpgrades : selectedUpgrades).join(', ')}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <p className="text-sm text-slate-500 text-center">
                                            Ao clicar em Enviar, você concorda com nossos termos. Nossa equipe entrará em contato pelo WhatsApp informado.
                                        </p>

                                        {submitError && (
                                            <p role="alert" className="text-sm text-red-600 text-center">{submitError}</p>
                                        )}

                                        <div className="flex justify-between pt-2">
                                            <Button type="button" onClick={prevStep} variant="ghost" className="text-slate-500 hover:text-slate-800">
                                                Corrigir algo
                                            </Button>
                                            <Button type="submit" size="lg" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-10 shadow-lg shadow-green-500/30 disabled:opacity-60">
                                                Enviar Solicitação
                                                <Send className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check className="text-green-600 w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Recebemos seu pedido!</h3>
                                        <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">
                                            Parabéns pela iniciativa de prosperar. Nossa equipe já recebeu seus dados e entrará em contato pelo WhatsApp <strong>{formData.whatsapp}</strong> em breve.
                                        </p>
                                        <Button
                                            onClick={() => setStep(1)}
                                            variant="outline"
                                            className="border-slate-200 text-slate-600 hover:bg-slate-50"
                                        >
                                            Voltar ao início
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Seus dados estão seguros. Não enviamos spam.</span>
                </div>
            </div>
        </section>
    );
};

export default WizardContact;
