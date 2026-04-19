import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-50">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Animated Background Element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full font-bold text-sm border border-primary/30 uppercase tracking-widest">
              <Sparkles size={16} /> Ready to start?
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Transform Your Time Into <span className="text-primary italic">Real Earnings</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl font-medium">
              Join our global community today. Whether you want to earn or get things done, we provide the perfect platform for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link 
                to="/register" 
                className="px-10 py-5 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2 active:scale-95"
              >
                Join Now <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-5 bg-white text-dark text-lg font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 active:scale-95"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
