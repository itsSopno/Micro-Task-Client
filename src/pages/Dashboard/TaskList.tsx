import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Briefcase, Calendar, Coins, Users, ArrowUpRight, Search } from 'lucide-react';

const TaskList = () => {
  const axiosSecure = useAxiosSecure();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['available-tasks'],
    queryFn: async () => {
      const res = await axiosSecure.get('/tasks/available');
      return res.data;
    }
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center">Loading tasks...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
            <Search size={32} /> Available Tasks
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Browse and complete tasks to start earning coins.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-full md:w-auto">
          <Search size={20} className="text-slate-400" />
          <input type="text" placeholder="Search tasks..." className="bg-transparent outline-none font-bold text-slate-700 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
             <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-black">No tasks available right now. Check back later!</p>
          </div>
        ) : tasks.map((task: any) => (
          <div key={task._id} className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col">
            <div className="relative h-48">
              <img src={task.task_image_url} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-primary font-black text-xs border border-white/20 shadow-lg">
                By {task.buyer_name}
              </div>
            </div>
            
            <div className="p-8 space-y-6 flex-grow flex flex-col">
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {task.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <Calendar size={14} className="text-primary" />
                  <span>{new Date(task.completion_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider justify-end">
                  <Users size={14} className="text-primary" />
                  <span>{task.required_workers} Left</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-indigo-700 font-black text-xl">
                  <Coins size={20} className="text-amber-500" />
                  <span>{task.payable_amount}</span>
                </div>
                <Link 
                  to={`/dashboard/task-details/${task._id}`}
                  className="p-3 bg-indigo-50 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
