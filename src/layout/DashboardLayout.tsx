import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ListTodo, 
  DollarSign, 
  History, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  Menu, 
  X,
  Home as HomeIcon,
  Coins,
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import NotificationDropdown from '../components/NotificationDropdown';

const DashboardLayout = () => {
  const { user, role, coins, logOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const buyerLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Buyer Home", path: "/dashboard" },
    { icon: <PlusCircle size={20} />, label: "Add New Tasks", path: "/dashboard/add-task" },
    { icon: <ListTodo size={20} />, label: "My Tasks", path: "/dashboard/my-tasks" },
    { icon: <DollarSign size={20} />, label: "Purchase Coin", path: "/dashboard/purchase-coin" },
    { icon: <History size={20} />, label: "Payment History", path: "/dashboard/payment-history" },
  ];

  const workerLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Worker Home", path: "/dashboard" },
    { icon: <ListTodo size={20} />, label: "Task List", path: "/dashboard/task-list" },
    { icon: <ClipboardCheck size={20} />, label: "My Submissions", path: "/dashboard/my-submissions" },
    { icon: <Wallet size={20} />, label: "Withdrawals", path: "/dashboard/withdrawals" },
  ];

  const adminLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Admin Home", path: "/dashboard" },
    { icon: <Users size={20} />, label: "Manage Users", path: "/dashboard/manage-users" },
    { icon: <ListTodo size={20} />, label: "Manage Tasks", path: "/dashboard/manage-tasks" },
    { icon: <DollarSign size={20} />, label: "Withdraw Requests", path: "/dashboard/withdraw-requests" },
  ];

  const commonLinks = [
    { icon: <HomeIcon size={20} />, label: "Home", path: "/" },
  ];

  const activeLinks = role === "Buyer" ? buyerLinks : role === "Worker" ? workerLinks : adminLinks;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Coins className="text-white" size={20} />
              </div>
              <span className="text-xl font-black text-slate-800 uppercase tracking-tight">MicroTask</span>
            </Link>
          </div>

          {/* User Section (Small) */}
          <div className="px-6 py-6 border-b bg-slate-50/50">
            <div className="flex items-center gap-3">
              <img src={user?.photoURL || ""} alt="User" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shadow-md" />
              <div className="overflow-hidden">
                <p className="font-bold text-slate-900 truncate">{user?.displayName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-primary text-[10px] font-black rounded-full uppercase">{role}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center gap-2 text-indigo-700 font-bold">
                 <Coins size={16} className="text-amber-500" />
                 <span>{coins}</span>
               </div>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Balance</span>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
            {activeLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                end={link.path === "/dashboard"}
                className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-primary text-white shadow-lg shadow-indigo-500/30' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="font-bold">{link.label}</span>
                {({isActive}) => isActive && <ChevronRight size={16} className="ml-auto" />}
              </NavLink>
            ))}

            <div className="pt-8 border-t border-slate-100 mt-8 space-y-2">
              {commonLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-100 transition-all font-bold"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-20 lg:hidden flex items-center justify-between px-6 bg-white border-b shadow-sm shrink-0">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
             <Menu size={28} />
           </button>
           <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">MicroTask</span>
           <div className="flex items-center gap-3">
             <NotificationDropdown />
             <img src={user?.photoURL || ""} alt="User" className="w-10 h-10 rounded-xl object-cover" />
           </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden lg:flex h-20 items-center justify-between px-12 bg-white border-b shrink-0">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-wider italic">
             Welcome back, <span className="text-primary">{user?.displayName?.split(' ')[0]}</span>!
           </h2>
           <div className="flex items-center gap-8">
             <NotificationDropdown />
             <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-tight">{user?.displayName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
                </div>
                <img src={user?.photoURL || ""} alt="User" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50 shadow-lg" />
             </div>
           </div>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#F8FAFC]">
          <Outlet />
        </main>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

// Simple Wallet icon for Nav
const Wallet = ({ size }: { size: number }) => <ClipboardCheck size={size} />;

export default DashboardLayout;
