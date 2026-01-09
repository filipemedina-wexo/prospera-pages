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
        <title>Prospera - Seu negócio pronto para prosperar online</title>
        <meta name="description" content="Tenha sua página profissional feita por especialistas. Design premium, copy persuasiva e tudo pronto para você vender." />
        <link rel="icon" type="image/png" href="https://horizons-cdn.hostinger.com/836a3bcf-4566-4dea-b476-99ce52484f28/0c64d83e8e5b3ca3e9c13746ec765490.png" />
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
