import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { Trophy, Coins, User } from 'lucide-react';

interface Worker {
  name: string;
  photo: string;
  coins: number;
}

const BestWorkers = () => {
  const axiosPublic = useAxiosPublic();

  const { data: workers = [], isLoading } = useQuery({
    queryKey: ['top-workers'],
    queryFn: async () => {
      const res = await axiosPublic.get('/users/top-workers');
      return res.data;
    }
  });

  if (isLoading) return <div className="h-40 flex items-center justify-center">Loading...</div>;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-primary rounded-full font-bold text-sm mb-4 border border-indigo-100 uppercase tracking-wider">
            <Trophy size={16} /> Leaderboard
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Our Best Workers
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Showcasing the top performers who have achieved the highest earnings on our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers.map((worker: Worker, idx: number) => (
            <div 
              key={idx} 
              className="group relative bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 overflow-hidden"
            >
              {/* Highlight Background */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src={worker.photo || "https://i.ibb.co/0nbjMB7/user.png"} 
                    alt={worker.name} 
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white group-hover:ring-primary/20 transition-all shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white">
                    {idx + 1}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {worker.name}
                  </h3>
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-lg">
                    <Coins size={18} className="text-amber-500" />
                    <span>{worker.coins}</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">Coins Earned</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Available Balance</span>
                  <span className="text-slate-900">${(worker.coins / 20).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestWorkers;
