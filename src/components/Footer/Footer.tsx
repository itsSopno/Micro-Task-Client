import React from 'react';
import { Facebook, Twitter, Github, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Github className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white uppercase tracking-tight">
                MicroTask
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering individuals worldwide to earn by completing simple tasks. The most trusted micro-tasking platform for workers and businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors bg-slate-800 p-2 rounded-lg"><Facebook size={18} /></a>
              <a href="#" className="hover:text-primary transition-colors bg-slate-800 p-2 rounded-lg"><Twitter size={18} /></a>
              <a href="#" className="hover:text-primary transition-colors bg-slate-800 p-2 rounded-lg"><Github size={18} /></a>
              <a href="#" className="hover:text-primary transition-colors bg-slate-800 p-2 rounded-lg"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="/" className="hover:text-primary transition-all">Home</a></li>
              <li><a href="/login" className="hover:text-primary transition-all">Login</a></li>
              <li><a href="/register" className="hover:text-primary transition-all">Register</a></li>
              <li><a href="/tasks" className="hover:text-primary transition-all">Available Tasks</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-primary transition-all">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-all">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><Mail size={18} className="text-primary" /> support@microtask.com</li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-primary" /> +1 (555) 000-0000</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> 123 Earn St, Digital City</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MicroTask. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
