import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import axios from 'axios';
import { Upload, Info, AlertTriangle, Send, Image as ImageIcon } from 'lucide-react';

const AddTask = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user, coins, refreshCoins } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const onSubmit = async (data: any) => {
    setError('');
    const totalPayable = data.required_workers * data.payable_amount;

    if (totalPayable > coins) {
      return navigate('/dashboard/purchase-coin', { state: { message: "Insufficient coins. Please purchase more." } });
    }

    setLoading(true);

    try {
      // 1. Upload Image to ImgBB
      const imageFile = data.task_image[0];
      const formData = new FormData();
      formData.append('image', imageFile);

      const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      const imageUrl = imgRes.data.data.display_url;

      // 2. Save Task to DB
      const newTask = {
        title: data.title,
        detail: data.detail,
        required_workers: parseInt(data.required_workers),
        payable_amount: parseInt(data.payable_amount),
        completion_date: data.completion_date,
        submission_info: data.submission_info,
        task_image_url: imageUrl,
        buyer_email: user?.email,
        buyer_name: user?.displayName,
        total_payable_amount: totalPayable,
        created_at: new Date()
      };

      const res = await axiosSecure.post('/tasks', newTask);
      if (res.data.insertedId) {
        await refreshCoins();
        navigate('/dashboard/my-tasks');
      }
    } catch (err: any) {
      setError("Failed to create task. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic">
          <Upload className="text-primary" /> Create New Task
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Fill in the details to post your micro-job to our global workforce.</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl overflow-hidden relative">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Task Title</label>
              <input 
                {...register("title", { required: true })}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold placeholder:text-slate-300"
                placeholder="e.g. Subscribe to my YouTube channel"
              />
            </div>

            {/* Completion Date */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Deadline</label>
              <input 
                {...register("completion_date", { required: true })}
                type="date"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
              />
            </div>

            {/* Workers Count */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Required Workers</label>
              <input 
                {...register("required_workers", { required: true, min: 1 })}
                type="number"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                placeholder="How many workers?"
              />
            </div>

            {/* Payable Amount */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Payable per Worker (Coins)</label>
              <input 
                {...register("payable_amount", { required: true, min: 1 })}
                type="number"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold"
                placeholder="Coins to pay each worker"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Task Detail Description</label>
            <textarea 
              {...register("detail", { required: true })}
              rows={4}
              className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold placeholder:text-slate-300"
              placeholder="Explain exactly what needs to be done..."
            />
          </div>

          {/* Submission Info */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Proof Requirements</label>
            <input 
              {...register("submission_info", { required: true })}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold placeholder:text-slate-300"
              placeholder="e.g. Send a screenshot of the comment"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">Task Image Background</label>
            <div className="relative group cursor-pointer">
              <input 
                {...register("task_image", { required: true })}
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full p-12 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 bg-slate-50 group-hover:bg-indigo-50/30 group-hover:border-primary/50 transition-all">
                <ImageIcon size={48} className="text-slate-300 group-hover:text-primary transition-colors" />
                <p className="font-bold text-slate-500 group-hover:text-primary transition-colors">Click or drag image to upload</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 font-bold border border-red-100">
               <AlertTriangle size={20} /> {error}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 uppercase">
            <div className="flex items-center gap-2 text-slate-400 font-black">
              <Info size={16} /> Max payable: <span className="text-slate-900 ml-1 italic">{coins} Coins</span>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-12 py-5 bg-primary text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:bg-slate-300"
            >
              {loading ? "Processing..." : "Submit Task"} <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
