import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Edit, Trash2, Calendar, Users, Coins, ExternalLink, X, Check } from 'lucide-react';

const MyTasks = () => {
  const { user, refreshCoins } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['my-tasks', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/buyer?email=${user?.email}`);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      refreshCoins();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await axiosSecure.patch(`/tasks/${data.id}`, data.update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
      setEditingTask(null);
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task? Coins for uncompleted spots will be refilled.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const update = {
      title: formData.get('title'),
      detail: formData.get('detail'),
      submission_info: formData.get('submission_info'),
    };
    updateMutation.mutate({ id: editingTask._id, update });
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic">
          <ListTodo className="text-primary" /> My Active Tasks
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Manage, update, or remove your existing tasks.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Task Info</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Workers</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold">No tasks found. Start by adding one!</td>
                 </tr>
              ) : tasks.map((task: any) => (
                <tr key={task._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={task.task_image_url} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-slate-900 leading-tight">{task.title}</p>
                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase">ID: {task._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black text-xs">
                      <Users size={14} /> {task.required_workers}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs">
                      <Coins size={14} /> {task.payable_amount}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Calendar size={16} /> {new Date(task.completion_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingTask(task)}
                        className="p-2 bg-indigo-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(task._id)}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="p-10">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-slate-900 italic">Update Task</h2>
                   <button onClick={() => setEditingTask(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                     <input 
                       name="title"
                       defaultValue={editingTask.title}
                       className="w-full px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                     <textarea 
                       name="detail"
                       rows={3}
                       defaultValue={editingTask.detail}
                       className="w-full px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Submission Info</label>
                     <input 
                       name="submission_info"
                       defaultValue={editingTask.submission_info}
                       className="w-full px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                     />
                   </div>

                   <button 
                     type="submit"
                     className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     <Check size={20} /> Save Changes
                   </button>
                </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple icon placeholder
const ListTodo = ({ className }: { className: string }) => <Edit3 className={className} />;
const Edit3 = ({ className }: any) => <ExternalLink className={className} />;

export default MyTasks;
