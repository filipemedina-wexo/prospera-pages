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

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:title" content="Prospera - Seu negócio pronto para prosperar online" />
        <meta property="og:description" content="Tenha sua página profissional feita por especialistas. Design premium, copy persuasiva e tudo pronto para você vender." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.origin} />
        <meta property="twitter:title" content="Prospera - Seu negócio pronto para prosperar online" />
        <meta property="twitter:description" content="Tenha sua página profissional feita por especialistas. Design premium, copy persuasiva e tudo pronto para você vender." />
        <meta property="twitter:image" content="/og-image.png" />
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
