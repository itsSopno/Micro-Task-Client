import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useAuth } from '../../providers/AuthProvider';
import { 
  Calendar, 
  Coins, 
  Users, 
  Info, 
  Image as ImageIcon, 
  Send, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${id}`);
      return res.data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const submission_details = formData.get('submission_details');

    setLoading(true);
    try {
      const submissionData = {
        task_id: task._id,
        task_title: task.title,
        payable_amount: task.payable_amount,
        worker_email: user?.email,
        worker_name: user?.displayName,
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        submission_details,
      };

      await axiosSecure.post('/submissions', submissionData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/my-submissions'), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center">Loading task details...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold uppercase text-xs tracking-widest"
      >
        <ArrowLeft size={16} /> Back to tasks
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Task Info */}
        <div className="lg:col-span-2 space-y-8">
           <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-2xl">
              <img src={task.task_image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-dark/80 to-transparent">
                 <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{task.title}</h1>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
              <div className="flex flex-wrap gap-8 py-6 border-b border-slate-50 uppercase text-xs font-black tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" /> End Date: <span className="text-slate-900 ml-1">{new Date(task.completion_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Slots: <span className="text-slate-900 ml-1">{task.required_workers} Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-amber-500" /> Reward: <span className="text-primary ml-1">{task.payable_amount} Coins</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 italic">Task Description</h3>
                <p className="text-slate-600 font-medium leading-relaxed text-lg">
                  {task.detail}
                </p>
              </div>

              <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Info size={20} className="text-primary" /> Submission Instructions
                </h3>
                <p className="text-slate-600 font-bold italic">
                  "{task.submission_info}"
                </p>
              </div>
           </div>
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-1">
           <div className="sticky top-24 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl space-y-8">
              <div className="text-center">
                 <div className="w-16 h-16 bg-indigo-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Send size={28} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 italic">Submit Proof</h2>
                 <p className="text-slate-400 font-bold mb-6 text-sm">Provide details as requested by the buyer.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-3">
                   <textarea 
                     name="submission_details"
                     required
                     rows={6}
                     placeholder="Type your proof or details here..."
                     className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-medium placeholder:text-slate-300"
                   />
                 </div>

                 {success && (
                    <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold border border-emerald-100 animate-in slide-in-from-top">
                      <CheckCircle2 size={18} /> Submission Successful!
                    </div>
                 )}

                 <button 
                   type="submit"
                   disabled={loading || success}
                   className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:bg-slate-300"
                 >
                   {loading ? "Submitting..." : success ? "Done" : "Submit Now"} <Send size={20} />
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
