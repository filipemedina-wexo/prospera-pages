import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const profiles = [
  'dependem de indicação',
  'têm Instagram, mas não têm site',
  'têm um site antigo ou confuso',
  'aparecem pouco nas buscas',
  'querem vender mais sem complicar',
];

const WhoIsFor = () => (
  <section id="who-is-for" className="py-24 bg-slate-50">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase">Para pequenos negócios</span>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3">Feito para empresas que:</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div key={profile} className="flex items-start gap-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <CheckCircle2 className="text-teal-600 flex-shrink-0 mt-0.5" size={22} />
            <span className="text-slate-700 font-medium">{profile}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhoIsFor;
