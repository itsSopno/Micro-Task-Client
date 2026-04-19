import React from 'react';
import { UserCheck, Edit3, Send, Wallet } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck size={32} />,
      title: "Create Account",
      desc: "Register as a Worker or Buyer and get your starting coins automatically.",
      color: "bg-blue-500"
    },
    {
      icon: <Edit3 size={32} />,
      title: "Post/Browse Tasks",
      desc: "Buyers post jobs with proof requirements. Workers browse and select tasks.",
      color: "bg-indigo-500"
    },
    {
      icon: <Send size={32} />,
      title: "Complete & Submit",
      desc: "Follow proof instructions, complete the task, and submit for verification.",
      color: "bg-violet-500"
    },
    {
      icon: <Wallet size={32} />,
      title: "Earn & Withdraw",
      desc: "Get approved, earn coins, and withdraw your earnings directly to your wallet.",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Get started in minutes with our simple and secure workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="text-center group">
              <div className={`w-28 h-28 mx-auto rounded-3xl ${step.color} text-white flex items-center justify-center mb-8 shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                {step.icon}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-black shadow-lg border border-slate-100">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
