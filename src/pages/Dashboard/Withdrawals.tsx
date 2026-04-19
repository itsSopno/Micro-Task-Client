import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Wallet, Info, Send, AlertCircle, CheckCircle2, ChevronRight, Coins as CoinIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Withdrawals = () => {
  const { user, coins, refreshCoins } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  
  const [withdrawCoins, setWithdrawCoins] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const minCoins = 200; // 10 dollars

  useEffect(() => {
    // 20 coins = 1 dollar
    setWithdrawAmount(withdrawCoins / 20);
  }, [withdrawCoins]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (withdrawCoins < minCoins) {
       setError(`Minimum withdrawal is ${minCoins} coins ($10)`);
       return;
    }

    if (withdrawCoins > coins) {
       setError("You cannot withdraw more than your available balance");
       return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const payment_system = formData.get('payment_system');
    const account_number = formData.get('account_number');

    if (!payment_system || !account_number) {
       setError("Please select a payment system and provide an account number");
       return;
    }

    setLoading(true);
    try {
      const withdrawalData = {
        worker_email: user?.email,
        worker_name: user?.displayName,
        withdrawal_coin: withdrawCoins,
        withdrawal_amount: withdrawAmount,
        payment_system,
        account_number,
        withdraw_date: new Date(),
        status: 'pending'
      };

      await axiosSecure.post('/withdrawals', withdrawalData);
      setSuccess(true);
      await refreshCoins();
    } catch (err) {
      setError("Failed to submit withdrawal request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <Wallet size={32} /> Withdraw Earnings
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Convert your hard-earned coins into real world currency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Summary */}
        <div className="space-y-8">
           <div className="bg-dark rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">Available Balance</p>
              <div className="flex items-center gap-3 mb-8">
                 <CoinIcon size={32} className="text-amber-400" />
                 <span className="text-5xl font-black">{coins}</span>
                 <span className="text-2xl text-slate-400">Coins</span>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                 <div>
                    <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Estimated Value</p>
                    <p className="text-2xl font-black text-emerald-400">${(coins / 20).toFixed(2)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-slate-400 font-bold uppercase text-[10px] mb-1">Min. Withdrawal</p>
                    <p className="text-xl font-black text-slate-200">${(minCoins / 20).toFixed(0)} (200 Coins)</p>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Info size={20} className="text-primary" /> Payout Information
              </h3>
              <ul className="space-y-3 text-slate-600 font-medium text-sm">
                <li className="flex items-start gap-2">• Payouts are processed within 24-48 hours.</li>
                <li className="flex items-start gap-2">• Conversion rate: 20 Coins = 1 USD.</li>
                <li className="flex items-start gap-2">• Make sure your account details are correct.</li>
              </ul>
           </div>
        </div>

        {/* Right: Withdrawal Form */}
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl relative">
           {coins < minCoins ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                  <AlertCircle size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 italic">Insufficient Coins</h3>
                  <p className="text-slate-400 font-bold mt-2">You need at least 200 coins to request a withdrawal.</p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/task-list')}
                  className="px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-slate-900 transition-all flex items-center gap-2 group"
                >
                  Go to Task List <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
           ) : success ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center scale-110 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 italic">Request Submitted!</h3>
                  <p className="text-slate-400 font-bold mt-2 leading-relaxed">Your withdrawal request is being processed. It will be reviewed by an admin shortly.</p>
                </div>
                <button 
                   onClick={() => setSuccess(false)}
                   className="text-primary font-black uppercase text-sm border-b-2 border-primary hover:text-dark hover:border-dark transition-all"
                >
                   Submit another request
                </button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Coins to Withdraw</label>
                     <input 
                       type="number"
                       required
                       min={minCoins}
                       max={coins}
                       value={withdrawCoins}
                       onChange={(e) => setWithdrawCoins(parseInt(e.target.value) || 0)}
                       className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-black text-xl"
                       placeholder="Enter amount..."
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Withdrawal Amount ($)</label>
                     <div className="w-full px-6 py-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                        <span className="text-3xl font-black text-primary">${withdrawAmount.toFixed(2)}</span>
                        <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-indigo-100 font-black text-indigo-400 uppercase">Fixed Rate</span>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment System</label>
                     <select 
                       name="payment_system"
                       required
                       className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                     >
                       <option value="bkash">Bkash</option>
                       <option value="nagad">Nagad</option>
                       <option value="rocket">Rocket</option>
                       <option value="stripe">Stripe</option>
                     </select>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Account Number / Email</label>
                     <input 
                       name="account_number"
                       type="text"
                       required
                       placeholder="e.g. +88017..."
                       className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                     />
                   </div>
                </div>

                {error && (
                   <div className="p-4 bg-red-50 text-red-500 flex items-center gap-2 rounded-2xl text-xs font-bold border border-red-100">
                      <AlertCircle size={16} /> {error}
                   </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {loading ? "Processing..." : "Submit Payout Request"} <Send size={20} />
                </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
