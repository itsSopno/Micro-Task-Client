import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { Menu, X, Coins, LayoutDashboard, LogOut, Github, User } from 'lucide-react';

const Navbar = () => {
  const { user, role, coins, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const navLinks = (
    <>
      <Link to="/" className="hover:text-primary transition-colors py-2">Home</Link>
      <a 
        href="https://github.com/your-repo" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-primary transition-colors py-2"
      >
        <Github size={18} /> Join as Developer
      </a>
      {user ? (
        <>
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors py-2 text-indigo-600 font-semibold">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 text-indigo-700 font-bold">
            <Coins size={18} className="text-amber-500" />
            <span>{coins}</span>
          </div>
          <div className="flex items-center gap-3 ml-2 border-l pl-4">
            <img 
              src={user.photoURL || "https://i.ibb.co/0nbjMB7/user.png"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            />
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all font-medium"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-200"
          >
            Register
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass-morphism border-b bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <Coins className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent uppercase tracking-tight">
              MicroTask
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-slate-700 font-medium">
            {navLinks}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 flex flex-col gap-4 text-slate-700 font-medium animate-in slide-in-from-top duration-300">
            {navLinks}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
