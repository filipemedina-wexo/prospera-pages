
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <img
              src="/logo-prospera-new.png"
              alt="Prospera Logo"
              className="h-24 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-slate-400 text-sm leading-relaxed">
              Transformando negócios em sucesso digital desde 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-bold text-lg mb-4 block">Links Rápidos</span>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection('beneficios')}
                className="block text-slate-400 hover:text-teal-400 transition-colors text-sm"
              >
                Benefícios
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="block text-slate-400 hover:text-teal-400 transition-colors text-sm"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection('planos')}
                className="block text-slate-400 hover:text-teal-400 transition-colors text-sm"
              >
                Planos
              </button>
              <button
                onClick={() => scrollToSection('depoimentos')}
                className="block text-slate-400 hover:text-teal-400 transition-colors text-sm"
              >
                Depoimentos
              </button>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <span className="font-bold text-lg mb-4 block">Contato</span>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail size={16} />
                <span>contato@prospera.com.br</span>
              </div>
              <a
                href="https://wa.me/5551997770870"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-sm"
              >
                <Phone size={16} />
                <span>(51) 99777-0870</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <span className="font-bold text-lg mb-4 block">Redes Sociais</span>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/useprospera.oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-500 flex items-center justify-center transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; 2024 Prospera. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/termos-de-uso" className="hover:text-teal-400 transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica-de-privacidade" className="hover:text-teal-400 transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
