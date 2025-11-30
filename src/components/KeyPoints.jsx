import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const keyPointsData = [
  {
    title: 'Pioneering Innovation',
    description: 'At Eclipse, we push the boundaries of what\'s possible in biotechnology. Our research teams are dedicated to developing next-generation solutions that address the world\'s most pressing challenges.',
    imageUrl: 'https://horizons-cdn.hostinger.com/36f30eda-834b-42f9-a84e-43ec8e57c10d/5f8a1873bfcd65ae6654eace280036fd.png',
    imageAlt: 'Futuristic robot assembling a microchip with precision tools',
    imagePosition: 'right',
  },
  {
    title: 'Data-Driven Insights',
    description: 'We harness the power of artificial intelligence and machine learning to analyze vast biological datasets. This allows us to uncover patterns and accelerate the discovery of novel therapies and diagnostics.',
    imageUrl: 'https://horizons-cdn.hostinger.com/36f30eda-834b-42f9-a84e-43ec8e57c10d/bb4216292594321b0f30a95be6aa5118.png',
    imageAlt: 'Scientist looking through a microscope in a laboratory with glowing blue accents',
    imageDescription: 'A focused female scientist meticulously examining samples through a high-powered microscope with modern glowing blue accents',
    imagePosition: 'left',
  },
  {
    title: 'Global Collaboration',
    description: 'Our platform connects leading scientists, researchers, and institutions from around the globe. By fostering a collaborative ecosystem, we accelerate progress and amplify our collective impact on human health.',
    imageUrl: 'https://horizons-cdn.hostinger.com/36f30eda-834b-42f9-a84e-43ec8e57c10d/d48f15222bf2d42fc15d68d07966ebbd.png',
    imageAlt: 'Businesswoman presenting a drone with a digital network background',
    imageDescription: 'A confident businesswoman presenting a high-tech drone with a complex digital network displayed on a large screen behind her, signifying global collaboration and advanced technology.',
    imagePosition: 'right',
  },
];

const KeyPointImage = ({ imageUrl, imageDescription, imageAlt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <div ref={ref} className="relative w-full max-w-md h-80 rounded-2xl p-2 bg-white/5 shadow-2xl shadow-blue-500/10 overflow-hidden">
        <motion.div className="w-full h-full" style={{ y }}>
          {imageUrl ? (
            <img
              className="w-full h-full object-cover rounded-lg scale-[1.3]"
              alt={imageAlt}
              src={imageUrl} />
          ) : (
            <img className="w-full h-full object-cover rounded-lg scale-[1.3]" alt={imageAlt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
          )}
        </motion.div>
      <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none"></div>
    </div>
  );
};


const KeyPoints = () => {
  const sectionVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 1.2,
      },
    },
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-[#08001a] to-[#17001a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-24">
        {keyPointsData.map((point, index) => (
          <motion.div
            key={index}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
          >
            <div className={`space-y-6 ${point.imagePosition === 'left' ? 'lg:order-last' : ''}`}>
              <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
                {point.title}
              </h2>
              <p className="text-lg text-gray-400 max-w-lg">
                {point.description}
              </p>
            </div>
            <div className="flex justify-center items-center">
               <KeyPointImage imageUrl={point.imageUrl} imageDescription={point.imageDescription} imageAlt={point.imageAlt} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default KeyPoints;