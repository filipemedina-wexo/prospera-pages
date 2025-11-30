import React from 'react';
import { motion } from 'framer-motion';
import { Dna, BrainCircuit, TestTube, Syringe, Laptop, BarChart } from 'lucide-react';

const solutionsData = [
  {
    icon: Dna,
    title: 'Genomic Analysis',
    description: 'Unlock insights from complex genomic data with our advanced sequencing and analysis platform.',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Discovery',
    description: 'Accelerate drug discovery and research using our predictive AI models and machine learning.',
  },
  {
    icon: TestTube,
    title: 'Virtual Lab Simulation',
    description: 'Simulate experiments and test hypotheses in a cost-effective, risk-free virtual environment.',
  },
  {
    icon: Syringe,
    title: 'Personalized Medicine',
    description: 'Develop patient-specific treatments by integrating multi-omics data and clinical records.',
  },
  {
    icon: Laptop,
    title: 'Collaborative Platform',
    description: 'Connect with researchers globally, share data securely, and manage projects efficiently.',
  },
  {
    icon: BarChart,
    title: 'Clinical Trial Analytics',
    description: 'Optimize trial design and recruitment with real-time data analysis and predictive insights.',
  },
];

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const Solutions = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#17001a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
            Comprehensive Solutions for Modern Science
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            From initial research to clinical application, our platform provides the tools you need to innovate and succeed.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((solution, index) => (
            <motion.div
              key={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white/5 rounded-2xl border border-white/10 shadow-lg shadow-blue-500/5 hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30">
                <solution.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{solution.title}</h3>
              <p className="mt-2 text-gray-400">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;