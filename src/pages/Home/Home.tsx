import React from 'react';
import Hero from './Hero';
import BestWorkers from './BestWorkers';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';
import PlatformStats from './PlatformStats';
import CTA from './CTA';

const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      <HowItWorks />
      <PlatformStats />
      <BestWorkers />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Home;
