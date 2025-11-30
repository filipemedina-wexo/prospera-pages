
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-[#0B0F19] text-center border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-gray-500">
          &copy; {currentYear} Prospera. Todos os direitos reservados.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Transformando pequenos negócios em grandes sucessos online
        </p>
      </div>
    </footer>
  );
};

export default Footer;
