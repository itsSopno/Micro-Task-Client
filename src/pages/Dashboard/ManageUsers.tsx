import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Users, Trash2, ShieldCheck, Mail, Coins, Edit3 } from 'lucide-react';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users/all');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string, role: string }) => {
      return await axiosSecure.patch(`/users/role/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleRoleChange = (id: string, role: string) => {
    roleMutation.mutate({ id, role });
  };

  if (isLoading) return <div className="h-64 flex items-center justify-center italic">Loading all users...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 italic text-primary">
          <Users size={32} /> Manage Users
        </h1>
        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-sm">Oversee all registered members, adjust roles, and manage access.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-center">Coins</th>
                <th className="px-8 py-6 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={user.photo} className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/10 shadow-sm" alt="" />
                      <span className="font-black text-slate-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <Mail size={14} className="text-primary" /> {user.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      defaultValue={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest outline-none border transition-all ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                        user.role === 'Buyer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Buyer">Buyer</option>
                      <option value="Worker">Worker</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-1 text-amber-600 font-black">
                      <Coins size={16} /> {user.coins}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Remove User"
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

export default ManageUsers;
