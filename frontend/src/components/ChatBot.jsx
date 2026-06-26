import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  Sparkles, 
  Terminal, 
  HelpCircle,
  Database,
  AlertCircle,
  X
} from 'lucide-react';
import axios from 'axios';

const ChatBot = ({ onSyncStudents, isMobileOpen, onCloseMobile }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Database Assistant. You can query or update student records using natural language. Try telling me: 'Mark roll 101 as Present' or 'Add student Alice, roll 105, class 10, section A.'",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorConfig, setErrorConfig] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setErrorConfig(null);

    try {
      // POST request to backend AI Route
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
        prompt: userMessage.text
      });

      const { success, dbMessage, explanation, command, students, mongooseQuery, affectedCount, queryResults } = response.data;

      if (success) {
        // Sync the updated student list to parent state
        if (students && onSyncStudents) {
          if (command && command.action === 'QUERY' && queryResults) {
            onSyncStudents(students, queryResults, userMessage.text);
          } else {
            onSyncStudents(students, null, null);
          }
        }

        const botMessage = {
          id: Date.now() + 1,
          sender: 'bot',
          text: explanation || dbMessage,
          timestamp: new Date(),
          command: command, // Expose parsed JSON command to UI
          mongooseQuery: mongooseQuery,
          affectedCount: affectedCount
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.message || 'Error processing query');
      }

    } catch (err) {
      console.error(err);
      
      let errorMsg = 'Failed to communicate with AI database service.';
      if (err.response?.data?.isConfigError) {
        setErrorConfig(err.response.data.message);
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = `AI Error: ${err.response.data.error}`;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: errorMsg,
        isError: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "Mark roll 101 as Present",
    "Add student Dave, roll 104, Class 9, section B",
    "Set attendance to Absent for roll 104",
    "Remove student roll 103",
    "Who is Present in Grade 10?"
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]" 
          onClick={onCloseMobile}
        />
      )}
      
      <div className={`h-full bg-slate-900 flex flex-col justify-between shrink-0 overflow-hidden shadow-md transition-transform duration-300 ease-in-out
        fixed inset-y-0 right-0 z-50 w-80 sm:w-96 lg:relative lg:translate-x-0 lg:w-96 lg:border-l lg:border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
        {/* Bot Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center glow-emerald animate-pulse-slow">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-slate-100">Llama 3 Assistant</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-400" /> Natural Language Interface
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors lg:hidden"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer" title="Help">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

      {/* Messages Logs */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${
                isBot ? 'self-start' : 'self-end items-end'
              }`}
            >
              {/* Sender label */}
              <span className="text-[9px] text-slate-500 mb-1 font-semibold tracking-wider font-mono">
                {isBot ? 'AI COPROCESSOR' : 'ROOT OPERATOR'}
              </span>

              {/* Message bubble */}
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                isBot
                  ? msg.isError 
                    ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-200'
                  : 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/15'
              }`}>
                {msg.text}

                {isBot && msg.command && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Transaction Log
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono ${
                        msg.command.action === 'CREATE' ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400' :
                        msg.command.action === 'UPDATE' ? 'bg-amber-950/40 border border-amber-500/20 text-amber-400' :
                        msg.command.action === 'DELETE' ? 'bg-rose-950/40 border border-rose-500/20 text-rose-400' :
                        'bg-blue-950/40 border border-blue-500/20 text-blue-400'
                      }`}>
                        {msg.command.action}
                      </span>
                    </div>

                    {/* Mongoose equivalent statement */}
                    {msg.mongooseQuery && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-500 font-mono">Mongoose Code:</span>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 font-mono text-[9px] text-emerald-400/90 overflow-x-auto whitespace-pre">
                          {msg.mongooseQuery}
                        </div>
                      </div>
                    )}

                    {/* Filter and Payload */}
                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                      {msg.command.filter && Object.keys(msg.command.filter).length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-500 font-mono">Query Filter:</span>
                          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900/60 font-mono text-[9px] text-slate-300 overflow-x-auto">
                            {JSON.stringify(msg.command.filter, null, 2)}
                          </div>
                        </div>
                      )}
                      {((msg.command.updateData && Object.keys(msg.command.updateData).length > 0) || (msg.command.data && Object.keys(msg.command.data).length > 0)) && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-500 font-mono">Payload/Data:</span>
                          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900/60 font-mono text-[9px] text-slate-300 overflow-x-auto">
                            {JSON.stringify(msg.command.updateData || msg.command.data, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metrics / Status */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold font-mono bg-slate-900/40 border border-slate-900 px-2 py-1.5 rounded-lg mt-1">
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-slate-400" /> Target: <span className="text-slate-300">students</span>
                      </div>
                      <div>
                        Affected: <span className={msg.affectedCount > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{msg.affectedCount || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Typing indicator */}
        {isLoading && (
          <div className="flex flex-col self-start max-w-[80%]">
            <span className="text-[9px] text-slate-500 mb-1 font-semibold font-mono">AI COPROCESSOR</span>
            <div className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] text-slate-400 font-medium font-mono pl-1">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-900 flex flex-col gap-2 bg-slate-950/45">
          <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Suggested Operations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {examplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(p)}
                className="text-[10px] text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 hover:border-emerald-500/30 px-2 py-1 rounded-lg transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Warning Box for config missing */}
      {errorConfig && (
        <div className="mx-4 mb-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl flex items-start gap-2 text-amber-400 text-[11px]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Credentials Required</p>
            <p className="text-[10px] text-amber-500/80">Configure <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">backend/.env</code> then restart.</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-800 bg-slate-950/30 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI database..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-emerald-600 shadow-md shadow-emerald-500/10 active:scale-95 duration-200"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
    </>
  );
};

export default ChatBot;
