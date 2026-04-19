import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { 
  ClipboardList, 
  Clock, 
  DollarSign, 
  Users, 
  Coins, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const DashboardHome = () => {
  const { user, role } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.email, role],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard-stats?email=${user?.email}&role=${role}`);
      return res.data;
    },
    enabled: !!user?.email && !!role
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  const Card = ({ icon, label, value, color }: any) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
       <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
       <div className="flex items-center gap-6 relative z-10">
         <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-slate-900 group-hover:scale-110 transition-transform`}>
           {React.cloneElement(icon, { className: color.replace('bg-', 'text-').replace('-500', '-600') })}
         </div>
         <div>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
           <p className="text-3xl font-black text-slate-900">{value}</p>
         </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="text-primary" /> Dashboard Overview
        </h1>
        <p className="text-slate-400 font-bold mt-2">Everything you need to know about your platform activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {role === 'Worker' && (
          <>
            <Card icon={<ClipboardList size={28} />} label="Total Submissions" value={stats?.totalSubmission || 0} color="bg-blue-500" />
            <Card icon={<Clock size={28} />} label="Pending Submissions" value={stats?.pendingSubmission || 0} color="bg-amber-500" />
            <Card icon={<DollarSign size={28} />} label="Total Earnings" value={`$${(stats?.totalEarning / 20).toFixed(2)}`} color="bg-emerald-500" />
          </>
        )}

        {role === 'Buyer' && (
          <>
            <Card icon={<ClipboardList size={28} />} label="Total Tasks Added" value={stats?.totalTaskCount || 0} color="bg-indigo-500" />
            <Card icon={<Clock size={28} />} label="Pending Requirements" value={stats?.pendingTaskCount || 0} color="bg-orange-500" />
            <Card icon={<DollarSign size={28} />} label="Total Payments Paid" value={`$${stats?.totalPaymentPaid || 0}`} color="bg-rose-500" />
          </>
        )}

        {role === 'Admin' && (
          <>
            <Card icon={<Users size={28} />} label="Total Workers" value={stats?.totalWorker || 0} color="bg-blue-500" />
            <Card icon={<Users size={28} />} label="Total Buyers" value={stats?.totalBuyer || 0} color="bg-purple-500" />
            <Card icon={<Coins size={28} />} label="Platform Coins" value={stats?.totalAvailableCoin || 0} color="bg-amber-500" />
            <Card icon={<DollarSign size={28} />} label="Total Revenue" value={`$${stats?.totalPayment || 0}`} color="bg-emerald-500" />
          </>
        )}
      </div>

      {/* Placeholder for Quick Actions or Recent Activity */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-200 border-dashed flex flex-col items-center justify-center gap-6 min-h-[300px]">
         <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
           {role === 'Buyer' ? <PlusCircle size={32} /> : role === 'Worker' ? <Search size={32} /> : <Settings size={32} />}
         </div>
         <div className="text-center">
           <h3 className="text-xl font-bold text-slate-900">Get started with your next action</h3>
           <p className="text-slate-400 mt-2 font-medium">Quickly navigate through the sidebar to manage your tasks and earnings.</p>
         </div>
      </div>
    </div>
  );
};

// Simple icons for the placeholder
const PlusCircle = ({ size }: any) => <AlertCircle size={size} />;
const Search = ({ size }: any) => <TrendingUp size={size} />;
const Settings = ({ size }: any) => <CheckCircle2 size={size} />;

export default DashboardHome;
