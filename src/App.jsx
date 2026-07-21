import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/Home.jsx';
import TermsOfUse from '@/pages/TermsOfUse.jsx';
import PrivacyPolicy from '@/pages/PrivacyPolicy.jsx';

function App() {
  return (
    <Router>
      <Helmet>
        <title>Site profissional para pequenos negócios | Prospera</title>
        <meta name="description" content="A Prospera cria, escreve e publica o site profissional da sua empresa para você ser encontrado, entendido e escolhido." />
        <link rel="icon" type="image/png" href="/logo-prospera-new.png" />
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/termos-de-uso" element={<TermsOfUse />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
