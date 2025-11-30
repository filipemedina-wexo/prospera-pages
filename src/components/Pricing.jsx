import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const pricingPlans = [
  {
    name: 'Researcher',
    price: '$49',
    frequency: '/month',
    description: 'For individual researchers and academics.',
    features: [
      'Access to core analysis tools',
      '100GB of data storage',
      'Community support',
      'Basic collaboration features',
    ],
    isFeatured: false,
  },
  {
    name: 'Lab Team',
    price: '$199',
    frequency: '/month',
    description: 'For small teams and research labs.',
    features: [
      'All features in Researcher',
      '1TB of data storage',
      'Advanced collaboration tools',
      'Priority email support',
      'AI model access',
    ],
    isFeatured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'For large organizations and institutions.',
    features: [
      'All features in Lab Team',
      'Unlimited storage',
      'Dedicated support & onboarding',
      'Custom integrations & APIs',
      'Advanced security & compliance',
    ],
    isFeatured: false,
  },
];

const Pricing = () => {
    const { toast } = useToast();

    const handleGetStarted = () => {
        toast({
            title: "This functionality is not added yet, but you can add it with your next prompts ❤️",
        });
    }

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-[#17001a] to-[#08001a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
            Flexible Pricing for Every Team
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Choose a plan that scales with your research needs. Start for free, no credit card required.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.isFeatured
                  ? 'bg-white/10 border-blue-500 shadow-2xl shadow-blue-500/20'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-grow">
                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-gray-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-x-2">
                  <span className="text-4xl font-bold tracking-tight text-white">{plan.price}</span>
                  {plan.frequency && <span className="text-sm font-semibold text-gray-400">{plan.frequency}</span>}
                </div>

                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-6 w-5 flex-none text-blue-400" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={handleGetStarted}
                variant={plan.isFeatured ? 'default' : 'outline'}
                className={`mt-8 w-full ${
                  plan.isFeatured
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'border-white/20 hover:bg-white/10 text-white'
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;