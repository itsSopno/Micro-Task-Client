import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Wallet, CheckCircle, Clock, User, DollarSign, Coins, CreditCard } from 'lucide-react';

const WithdrawRequests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['pending-withdrawals'],
    queryFn: async () => {
      const res = await axiosSecure.get('/withdrawals/pending');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.patch(`/withdrawals/approve/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading withdrawal requests...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <Wallet size={32} /> Payout Requests
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Review and approve pending withdrawal requests from workers.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Worker</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Coins</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Amount ($)</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Payment Info</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No pending withdrawal requests.</td>
                 </tr>
              ) : requests.map((req: any) => (
                <tr key={req._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                        {req.worker_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{req.worker_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{req.worker_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 font-black text-amber-600">
                      <Coins size={16} /> {req.withdrawal_coin}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-0.5 font-black text-emerald-600 text-lg">
                      <DollarSign size={18} /> {req.withdrawal_amount}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                        <CreditCard size={12} /> {req.payment_system}
                      </div>
                      <p className="text-sm font-bold text-slate-700">{req.account_number}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => approveMutation.mutate(req._id)}
                      className="px-6 py-3 bg-indigo-50 text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 text-xs uppercase tracking-widest"
                    >
                      Approve Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequests;
