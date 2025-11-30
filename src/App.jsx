
import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RealStory from '@/components/RealStory';
import Problem from '@/components/Problem';
import BeforeAfter from '@/components/BeforeAfter';
import SlotsOffer from '@/components/SlotsOffer';
import Benefits from '@/components/Benefits';
import WhoIsFor from '@/components/WhoIsFor';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

function App() {
  return (
    <>
      <Helmet>
        <title>Prospera - Transforme Seu Pequeno Negócio</title>
        <meta name="description" content="Crie sua landing page profissional e pare de perder clientes. Solução completa para pequenos negócios por apenas R$500." />
      </Helmet>
      <div className="min-h-screen overflow-x-hidden bg-[#0B0F19] text-white selection:bg-cyan-500/30">
        <Header />
        <main>
          <Hero />
          <RealStory />
          <Problem />
          <BeforeAfter />
          <SlotsOffer />
          <Benefits />
          <WhoIsFor />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
