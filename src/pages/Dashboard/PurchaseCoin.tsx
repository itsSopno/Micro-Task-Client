import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Coins, ShieldCheck, Zap, CreditCard, ChevronRight } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const coinPackages = [
  { coins: 10, price: 1, label: "Starter Pack", icon: <Coins size={32} /> },
  { coins: 150, price: 10, label: "Growth Pack", icon: <Zap size={32} /> },
  { coins: 500, price: 20, label: "Business Pack", icon: <ShieldCheck size={32} /> },
  { coins: 1000, price: 35, label: "Enterprise Pack", icon: <CreditCard size={32} /> },
];

const PurchaseCoin = () => {
  const [selectedPack, setSelectedPack] = useState<any>(null);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic">
          <DollarSignIcon className="text-primary" /> Purchase Coins
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Refill your balance to post more tasks and grow your reach.</p>
      </div>

      {!selectedPack ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coinPackages.map((pack, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedPack(pack)}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-2 text-center group relative overflow-hidden flex flex-col items-center"
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="w-16 h-16 bg-slate-50 text-primary rounded-2xl flex items-center justify-center mb-6 px-4 group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-sm relative z-10">
                {pack.icon}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1">{pack.label}</h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-4xl font-black text-slate-900">{pack.coins}</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Coins</span>
              </div>
              
              <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                 <span className="text-2xl font-black text-emerald-600">${pack.price}</span>
                 <div className="p-2 bg-indigo-50 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                   <ChevronRight size={20} />
                 </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl relative">
              <button 
                onClick={() => setSelectedPack(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase text-xs"
              >
                Change Package
              </button>
              
              <div className="text-center mb-10">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Selected Package</p>
                <h2 className="text-2xl font-black text-slate-900">{selectedPack.label}</h2>
                <div className="flex items-center justify-center gap-2 mt-2 text-primary font-black text-xl">
                  <Coins size={20} className="text-amber-500" /> {selectedPack.coins} Coins for ${selectedPack.price}
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm selectedPack={selectedPack} />
              </Elements>

              <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 p-4 rounded-2xl">
                <ShieldCheck size={16} className="text-emerald-500" /> Secure SSL Encrypted Payment
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const DollarSignIcon = ({ className }: any) => <DollarSign size={32} className={className} />;
const DollarSign = ({ className, size }: any) => <CreditCard size={size} className={className} />;

export default PurchaseCoin;
