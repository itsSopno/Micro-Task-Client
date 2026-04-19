import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { ClipboardList, Calendar, Coins, ChevronLeft, ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

const MySubmissions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: result, isLoading } = useQuery({
    queryKey: ['my-submissions', user?.email, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/worker?email=${user?.email}&page=${currentPage}&limit=${itemsPerPage}`);
      return res.data;
    }
  });

  const { submissions = [], totalPages = 1 } = result || {};

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading your submissions...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <ClipboardList size={32} /> My Submissions
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Track your progress and earnings status.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-grow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Task Title</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Buyer</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No submissions found. Go find some tasks!</td>
                 </tr>
              ) : submissions.map((sub: any) => (
                <tr key={sub._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6 font-bold text-slate-900 truncate max-w-xs">{sub.task_title}</td>
                  <td className="px-8 py-6 font-medium text-slate-600 italic">{sub.buyer_name}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs border border-amber-100">
                      <Coins size={14} /> {sub.payable_amount}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                      sub.status === 'approve' ? 'bg-emerald-50 text-emerald-600' :
                      sub.status === 'rejected' ? 'bg-rose-50 text-rose-500' :
                      'bg-indigo-50 text-primary'
                    }`}>
                      {sub.status === 'approve' ? <CheckCircle2 size={12} /> :
                       sub.status === 'rejected' ? <XCircle size={12} /> :
                       <Clock size={12} />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right text-slate-400 font-bold text-sm">
                    {new Date(sub.current_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between">
           <p className="text-sm text-slate-400 font-bold">
             Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
           </p>
           <div className="flex gap-2">
             <button 
               disabled={currentPage === 1}
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               className="p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               disabled={currentPage === totalPages}
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               className="p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
             >
               <ChevronRight size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MySubmissions;
