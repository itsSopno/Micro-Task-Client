import React from 'react';
import { Users, CheckCircle, Briefcase, DollarSign } from 'lucide-react';

const PlatformStats = () => {
  const stats = [
    { icon: <Users size={32} />, label: "Active Workers", value: "50K+" },
    { icon: <CheckCircle size={32} />, label: "Tasks Completed", value: "1.2M+" },
    { icon: <Briefcase size={32} />, label: "Active Buyers", value: "5K+" },
    { icon: <DollarSign size={32} />, label: "Total Paid Out", value: "$2.5M+" },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center text-white space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-2">
                {stat.icon}
              </div>
              <h3 className="text-4xl md:text-5xl font-black">{stat.value}</h3>
              <p className="text-indigo-100 font-bold uppercase tracking-wider text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
