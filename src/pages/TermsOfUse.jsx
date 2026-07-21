import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 py-4">
                <div className="container mx-auto px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Voltar ao site</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">Termos de Uso</h1>

                <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
                    <p className="text-sm text-slate-500">Última atualização: Dezembro de 2024</p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e utilizar os serviços do Prospera, você concorda em cumprir e estar vinculado a estes Termos de Uso.
                            Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">2. Descrição dos Serviços</h2>
                        <p>
                            O Prospera oferece serviços de criação de páginas e sites profissionais para micro e pequenas empresas, incluindo:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Desenvolvimento de páginas web personalizadas</li>
                            <li>Design profissional e responsivo</li>
                            <li>Redação de conteúdo (copywriting)</li>
                            <li>Hospedagem de sites</li>
                            <li>Registro e configuração de domínios</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">3. Planos e Pagamentos</h2>
                        <p>
                            Os valores e condições de cada plano estão descritos em nossa página de preços.
                            Os pagamentos devem ser realizados conforme acordado no momento da contratação.
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Plano Essencial:</strong> a partir de R$ 1.400</li>
                            <li><strong>Site Completo:</strong> a partir de R$ 2.000</li>
                            <li><strong>Projetos Especiais:</strong> Valor sob consulta</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">4. Prazo de Entrega</h2>
                        <p>
                            O prazo de entrega varia conforme o tipo de projeto contratado e será informado durante o processo de briefing.
                            O cliente se compromete a fornecer todas as informações solicitadas para a execução do projeto.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">5. Direitos de Propriedade</h2>
                        <p>
                            Após a conclusão e pagamento integral do projeto:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>O cliente terá direito de uso do site desenvolvido</li>
                            <li>Imagens e conteúdos fornecidos pelo cliente permanecem de sua propriedade</li>
                            <li>O Prospera reserva o direito de utilizar o projeto em seu portfólio</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">6. Hospedagem</h2>
                        <p>
                            O primeiro ano de hospedagem está incluso nos planos Essencial e Site Completo.
                            Após este período, a renovação será cobrada conforme valores vigentes.
                            O cliente será notificado com antecedência sobre a renovação.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">7. Cancelamento e Reembolso</h2>
                        <p>
                            Em caso de cancelamento antes do início do projeto, o valor pago será reembolsado integralmente.
                            Após o início dos trabalhos, o reembolso será proporcional ao trabalho não executado.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">8. Limitação de Responsabilidade</h2>
                        <p>
                            O Prospera não se responsabiliza por:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Conteúdos fornecidos pelo cliente</li>
                            <li>Resultados de vendas ou conversões</li>
                            <li>Problemas técnicos de terceiros (provedores, registradores, etc.)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">9. Alterações dos Termos</h2>
                        <p>
                            O Prospera reserva o direito de modificar estes termos a qualquer momento.
                            As alterações entram em vigor imediatamente após sua publicação.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-slate-800">10. Contato</h2>
                        <p>
                            Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
                        </p>
                        <ul className="list-none space-y-1">
                            <li><strong>WhatsApp:</strong> (51) 99777-0870</li>
                            <li><strong>E-mail:</strong> contato@prospera.com.br</li>
                            <li><strong>Instagram:</strong> @useprospera.oficial</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <Link to="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Voltar ao site</span>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default TermsOfUse;
