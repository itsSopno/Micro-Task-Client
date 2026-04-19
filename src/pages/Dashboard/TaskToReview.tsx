import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { ClipboardCheck, Check, X, Eye, User as UserIcon, Coins } from 'lucide-react';

const TaskToReview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['buyer-submissions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/buyer?email=${user?.email}`);
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.patch(`/submissions/approve/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-submissions'] });
      setSelectedSubmission(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.patch(`/submissions/reject/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-submissions'] });
      setSelectedSubmission(null);
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading submissions...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <ClipboardCheck size={32} /> Submissions to Review
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Review worker submissions and release payments.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Worker</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Task Title</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">No pending submissions to review.</td>
                 </tr>
              ) : submissions.map((sub: any) => (
                <tr key={sub._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary font-bold">
                        {sub.worker_name?.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{sub.worker_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-700 truncate max-w-xs">{sub.task_title}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs border border-amber-100">
                      <Coins size={14} /> {sub.payable_amount}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-2.5 bg-indigo-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => approveMutation.mutate(sub._id)}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => rejectMutation.mutate(sub._id)}
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-2xl font-black text-slate-900 italic">Submission Evidence</h2>
                   <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="space-y-8">
                   <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl">
                      <UserIcon size={32} className="text-slate-400 mt-1" />
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Worker Detail</p>
                        <p className="font-bold text-slate-900">{selectedSubmission.worker_name} ({selectedSubmission.worker_email})</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Submission Details / Proof Text</p>
                     <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100 text-slate-700 font-medium leading-relaxed italic">
                        "{selectedSubmission.submission_details}"
                     </div>
                   </div>

                   <div className="flex gap-4 pt-6 border-t border-slate-100">
                      <button 
                        onClick={() => approveMutation.mutate(selectedSubmission._id)}
                        className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Check size={20} /> Approve Submission
                      </button>
                      <button 
                         onClick={() => rejectMutation.mutate(selectedSubmission._id)}
                        className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <X size={20} /> Reject Submission
                      </button>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TaskToReview;
