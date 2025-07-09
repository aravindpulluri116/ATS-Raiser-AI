import React from 'react';
import { FileText, User, LogOut, BarChart3 } from 'lucide-react';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
  onNavigate: (view: 'landing' | 'upload' | 'results') => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg group-hover:shadow-glow transition-all duration-300">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-slate-100">ATS Raiser AI</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('landing')}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('upload')}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-200 flex items-center space-x-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analyze Resume</span>
            </button>
            <a href="#features" className="text-slate-400 hover:text-slate-200 transition-colors duration-200">
              Features
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('upload')}
              className="button-primary"
            >
              Start Free Analysis
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;