import React, { useState } from 'react';
import Header from '@/components/Header.jsx';
import Hero from '@/components/Hero.jsx';
import ProblemStatement from '@/components/ProblemStatement.jsx';
import WhatYouReceive from '@/components/WhatYouReceive.jsx';
import WhoIsFor from '@/components/WhoIsFor.jsx';
import Transformation from '@/components/Transformation.jsx';
import HowItWorks from '@/components/HowItWorks.jsx';
import Portfolio from '@/components/Portfolio.jsx';
import Upgrades from '@/components/Upgrades.jsx';
import Pricing from '@/components/Pricing.jsx';
import FAQ from '@/components/FAQ.jsx';
import WizardContact from '@/components/WizardContact.jsx';
import Footer from '@/components/Footer.jsx';
import Chatbot from '@/components/Chatbot.jsx';

const Home = () => {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedUpgrades, setSelectedUpgrades] = useState([]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Header />
            <main>
                <Hero />
                <ProblemStatement />
                <WhatYouReceive />
                <WhoIsFor />
                <Transformation />
                <HowItWorks />
                <Portfolio />
                <Pricing
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                />
                <Upgrades
                    selectedUpgrades={selectedUpgrades}
                    setSelectedUpgrades={setSelectedUpgrades}
                />
                <FAQ />
                <WizardContact
                    selectedPlan={selectedPlan}
                    selectedUpgrades={selectedUpgrades}
                />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
};

export default Home;
