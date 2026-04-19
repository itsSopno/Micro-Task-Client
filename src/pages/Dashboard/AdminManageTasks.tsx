import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { ListTodo, Trash2, User, Coins, Calendar, ExternalLink } from 'lucide-react';

const AdminManageTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['admin-all-tasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks/available'); // Admins see all available tasks
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-tasks'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task? Coins for uncompleted spots will be refilled to the buyer's account.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading all active tasks...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <ListTodo size={32} /> Central Task Management
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Monitor all platform activity and remove inappropriate tasks.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Task Details</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Buyer</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Reward</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Deadline</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task: any) => (
                <tr key={task._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={task.task_image_url} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                      <span className="font-black text-slate-900 truncate max-w-[200px]">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <User size={14} className="text-primary" /> {task.buyer_name}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-xs">
                      <Coins size={14} /> {task.payable_amount}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                      <Calendar size={14} /> {new Date(task.completion_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(task._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Force Delete Task"
                    >
                      <Trash2 size={18} />
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

export default AdminManageTasks;
