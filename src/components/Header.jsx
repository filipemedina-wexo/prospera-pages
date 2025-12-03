import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <img src="/images/logo-prospera.png" alt="Prospera Logo" className="h-20 w-auto" />

        <button
          onClick={scrollToForm}
          className="hidden md:block px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          Garantir Minha Vaga
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
