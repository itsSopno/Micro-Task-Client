import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useAuth } from '../providers/AuthProvider';
import { Bell, Clock, Info, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    refetchInterval: 10000 // Refetch every 10 seconds
  });

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2 rounded-xl hover:bg-slate-50 transition-all active:scale-90"
      >
        <Bell size={24} className={`${isOpen ? 'text-primary' : 'text-slate-400'} group-hover:text-primary transition-colors`} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Notifications</h3>
               <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg">NEW</span>
             </div>
             
             <div className="max-h-[450px] overflow-y-auto">
               {notifications.length === 0 ? (
                 <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell size={24} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No new notifications</p>
                 </div>
               ) : (
                 notifications.map((notif: any) => (
                   <div key={notif._id} className="p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4 group">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex-shrink-0 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         {notif.message.includes('earned') || notif.message.includes('approved') ? <CheckCircle size={18} /> : <Info size={18} />}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-slate-700 leading-relaxed mb-1">{notif.message}</p>
                         <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Clock size={10} />
                            {formatDistanceToNow(new Date(notif.time))} ago
                         </div>
                      </div>
                   </div>
                 ))
               )}
             </div>

             <button className="w-full py-4 bg-white hover:bg-slate-50 border-t text-primary text-xs font-black uppercase tracking-widest transition-colors">
               View All Activity
             </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
