import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  BookOpen, 
  Code2, 
  Cpu, 
  Workflow, 
  User, 
  ArrowRight, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

const AboutProject = () => {
  const techStack = [
    {
      name: 'MongoDB Atlas',
      role: 'Database Sandbox',
      desc: 'Hosted cloud database containing isolated student documents that can be safely mutated, query-filtered, or wiped.',
      icon: Database,
      glow: 'shadow-emerald-500/10 border-emerald-500/20'
    },
    {
      name: 'Express & Node.js',
      role: 'Backend API Engine',
      desc: 'REST API endpoints managing Mongoose schemas, routes, database resets, and communications with Groq SDK.',
      icon: Code2,
      glow: 'shadow-blue-500/10 border-blue-500/20'
    },
    {
      name: 'React.js & Vite',
      role: 'Frontend UI Client',
      desc: 'A high-contrast, fully responsive MERN interface with live metrics, filters, data grids, and mobile navigation overlays.',
      icon: Cpu,
      glow: 'shadow-purple-500/10 border-purple-500/20'
    },
    {
      name: 'Llama 3 (Groq SDK)',
      role: 'AI Coprocessor',
      desc: 'Supercharged 70B model parsing user natural language inputs directly into structured database action payloads.',
      icon: Sparkles,
      glow: 'shadow-amber-500/10 border-amber-500/20'
    }
  ];

  const steps = [
    {
      title: 'Prompt Input',
      desc: 'User queries the chatbot with natural language (e.g. "Add $50 to Grade 10 balances").'
    },
    {
      title: 'Groq Compilation',
      desc: 'LLM translates the text prompt into structured Mongoose query configurations (JSON).'
    },
    {
      title: 'Mongoose Execution',
      desc: 'Express route executes corresponding query models (e.g. Student.updateMany) with operations.'
    },
    {
      title: 'Client State Sync',
      desc: 'Table displays mutated data grid while transaction console renders equivalent Mongoose JS code.'
    }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-10 bg-white animate-[fadeIn_0.2s_ease-out]">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-600 animate-pulse" /> Project Specifications
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Detailed guide, architecture blueprints, technology blueprints, and workflow lifecycles.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-mono font-bold text-emerald-700">
          MERN + AI Coprocessor Stack v1.0
        </div>
      </div>

<div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative flex flex-col gap-6">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

<div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              Sandbox System Guide & Technology Blueprint
            </h3>
            <p className="text-xs text-emerald-600 font-bold font-mono tracking-wide uppercase mt-1">
              Natural Language Interfaces to Databases (NLIDB) Playground
            </p>
          </div>
        </div>

<p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
          This dashboard operates as an interactive database sandbox designed to research prompt-to-database interfaces.
          By combining a standard CRUD interface with a Groq-powered natural language coprocessor, users can execute database queries, updates, and deletes by simply talking to the assistant.
          The Mongoose actions are made fully transparent in a transaction console to study LLM accuracy and database driver interactions safely.
        </p>
      </div>

<div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-mono">
          <Code2 className="w-5 h-5 text-slate-700" /> 🛠️ The Tech Stack Blueprint
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          MERN stack framework integrated with Groq SDK LLM engine to map operations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div 
                key={idx} 
                className={`p-5 bg-slate-50 border rounded-2xl flex flex-col gap-3.5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${tech.glow}`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-slate-800" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{tech.name}</h4>
                  <span className="text-[10px] text-emerald-650 font-bold font-mono uppercase tracking-wide">{tech.role}</span>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">{tech.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

<div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-mono">
          <Workflow className="w-5 h-5 text-slate-700" /> ⚙️ Translation Lifecycle
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          How user natural language prompts are compiled, mapped, executed, and synced in real-time:
        </p>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-xs text-slate-850 uppercase tracking-wider">{step.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1.5">{step.desc}</p>

{idx < 3 && (
                  <div className="hidden md:block absolute top-3.5 -right-3.5 transform translate-x-1/2 text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

<div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-mono">
          <User className="w-5 h-5 text-slate-700" /> 👤 Authorship & Credentials
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Developer details and authorization clearance:
        </p>
        <div className="p-6 bg-slate-900 border border-slate-850/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-650 flex items-center justify-center font-bold text-white shadow-md border border-slate-750">
              SAH
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Shujaat Ali Hashim</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Full-Stack MERN Developer • Sandbox Admin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-4 text-xs font-mono text-slate-300">
            <div className="px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role: <span className="text-emerald-400 font-bold">Root Admin</span></span>
            </div>
            <div className="px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Database Access: <span className="text-emerald-400 font-bold">Read / Write</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
