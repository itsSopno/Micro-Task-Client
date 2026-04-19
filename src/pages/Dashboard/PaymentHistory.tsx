import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { History, Calendar, Hash, Coins, DollarSign } from 'lucide-react';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payment-history', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/history?email=${user?.email}`);
      return res.data;
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading payment history...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <History size={32} /> Payment History
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Keep track of all your coin purchases and financial transactions.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Coins Purchased</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Amount Paid</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                 <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">No payment history found.</td>
                 </tr>
              ) : payments.map((pay: any) => (
                <tr key={pay._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <Hash size={16} className="text-slate-300" />
                      <span className="truncate max-w-[200px]">{pay.transactionId}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full font-black text-sm border border-amber-100 shadow-sm">
                      <Coins size={16} /> {pay.coins}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1 text-emerald-600 font-black text-lg">
                      <DollarSign size={18} /> {pay.price}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-500 font-bold text-sm">
                      <Calendar size={16} className="text-slate-300" />
                      {new Date(pay.date).toLocaleString()}
                    </div>
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

export default PaymentHistory;
