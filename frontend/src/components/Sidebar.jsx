import React from 'react';
import { 
  Users, 
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  X
} from 'lucide-react';

const Sidebar = ({ activeTab = 'sandbox', setActiveTab, onResetData, isOpen, onClose }) => {
  const menuItems = [
    { id: 'about', name: 'About Project', icon: BookOpen },
    { id: 'sandbox', name: 'Sandbox', icon: Users },
  ];

  return (
    <aside className={`w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between py-6 px-4 shrink-0 shadow-md transition-transform duration-300 ease-in-out z-50
      fixed inset-y-0 left-0 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex flex-col gap-8">
        
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-100">
                PromptBase Sandbox
              </h1>
              <p className="text-[9px] text-emerald-450 font-bold font-mono tracking-wider">
                v1.0.0 • LLAMA-3
              </p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors md:hidden"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

<nav className="flex flex-col gap-1.5">
          <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
            Main Terminal
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'text-emerald-400 bg-slate-800/80 border border-emerald-500/20 shadow-inner'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r" />
                )}
                
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                }`} />
                <span>{item.name}</span>

<div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6 mt-auto">
        
        {onResetData && (
          <div className="px-2">
            <div className="bg-rose-950/20 border border-rose-500/20 p-3.5 rounded-xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[9px]  font-extrabold text-white uppercase tracking-widest font-mono">
                Danger Zone
              </span>
              <p className="text-[10px] text-white leading-relaxed font-semibold">
                Wipes all mutations and reseeds the table with dummy records.
              </p>
              <button
                onClick={onResetData}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-900/50 border border-rose-500/20 hover:border-rose-400 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 font-bold py-2 rounded-lg transition-all duration-300 text-xs mt-1 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Sandbox Data
              </button>
            </div>
          </div>
        )}

<div className="border-t border-slate-800 pt-5 flex items-center gap-3 px-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-650 flex items-center justify-center font-bold text-sm shadow-md border border-slate-800 text-white">
              SAH
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Shujaat Ali Hashim</p>
            <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
