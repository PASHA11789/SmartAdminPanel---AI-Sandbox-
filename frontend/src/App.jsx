import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import DashboardTable from './components/DashboardTable';
import ChatBot from './components/ChatBot';
import AboutProject from './components/AboutProject';
import { AlertCircle, RefreshCw, ServerOff, Menu, Bot, GraduationCap } from 'lucide-react';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const cleanApiUrl = rawApiUrl.replace(/\/$/, '').replace(/\/api\/students$/, '').replace(/\/students$/, '');

const API_BASE_URL = `${cleanApiUrl}/api/students`;

const App = () => {
  const [activeTab, setActiveTab] = useState('sandbox');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [activeQueryText, setActiveQueryText] = useState(null);

useEffect(() => {
    setIsSidebarOpen(false);
    setIsChatbotOpen(false);
  }, [activeTab]);

const fetchStudents = async () => {
    setLoading(true);
    setServerError(false);
    setQueryResults(null);
    setActiveQueryText(null);
    try {
      const response = await axios.get(API_BASE_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setServerError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

const triggerSystemMessage = (msg, isError = false) => {
    setSystemMessage({ text: msg, isError });
    setTimeout(() => {
      setSystemMessage(null);
    }, 4000);
  };

const handleAddStudent = async (studentData) => {
    try {
      const response = await axios.post(API_BASE_URL, studentData);
      setStudents(prev => [...prev, response.data].sort((a, b) => a.rollNo.localeCompare(b.rollNo)));
      triggerSystemMessage(`Successfully added student: ${studentData.name}`);
      return true;
    } catch (error) {
      console.error('Error adding student:', error);
      const errMsg = error.response?.data?.message || 'Failed to create student.';
      triggerSystemMessage(errMsg, true);
      return false;
    }
  };

const handleEditStudent = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
      setStudents(prev => 
        prev.map(student => student._id === id ? response.data : student)
            .sort((a, b) => a.rollNo.localeCompare(b.rollNo))
      );
      triggerSystemMessage(`Updated student record: ${updatedData.name}`);
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      const errMsg = error.response?.data?.message || 'Failed to update student.';
      triggerSystemMessage(errMsg, true);
      return false;
    }
  };

const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setStudents(prev => prev.filter(student => student._id !== id));
      triggerSystemMessage('Student record deleted successfully.');
    } catch (error) {
      console.error('Error deleting student:', error);
      triggerSystemMessage('Failed to delete student.', true);
    }
  };

const handleResetData = async () => {
    if (!window.confirm('WARNING: This will clear the current database and restore the default seed dataset. Are you sure you want to proceed?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset`);
      
      setStudents(response.data.students);
      triggerSystemMessage(response.data.message || 'Database reset successfully.');
    } catch (error) {
      console.error('Error resetting database:', error);
      const errMsg = error.response?.data?.message || 'Failed to reset database.';
      triggerSystemMessage(errMsg, true);
    } finally {
      setLoading(false);
    }
  };

const handleSyncStudents = (updatedList, results = null, queryText = null) => {
    setStudents(updatedList.sort((a, b) => a.rollNo.localeCompare(b.rollNo)));
    setQueryResults(results);
    setActiveQueryText(queryText);
    triggerSystemMessage('Database sync updated by AI Agent.');
  };

  return (
    <div className="h-screen w-screen bg-white text-slate-900 flex overflow-hidden select-none relative">
      
      {systemMessage && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 animate-[fadeIn_0.2s_ease-out] text-xs font-semibold ${
          systemMessage.isError
            ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
            : 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
        }`}>
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{systemMessage.text}</span>
        </div>
      )}

{isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden animate-[fadeIn_0.2s_ease-out]" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

<Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onResetData={handleResetData} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

<main className="flex-1 flex flex-col min-w-0 bg-white relative">
        
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-xs tracking-wider uppercase font-mono text-slate-100">PromptBase Sandbox</span>
          </div>
          {activeTab === 'sandbox' ? (
            <button 
              onClick={() => setIsChatbotOpen(true)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors relative"
              title="Open Chat"
            >
              <Bot className="w-5 h-5 text-emerald-400" />
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>

{serverError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-center text-rose-400 glow-rose animate-bounce">
              <ServerOff className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">Database Server Connection Failed</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                Unable to query backend API. Please make sure the backend Express server is running on <code className="bg-slate-900 text-slate-300 px-1 py-0.5 rounded text-xs font-mono">{cleanApiUrl}</code>.
              </p>
            </div>
            <button
              onClick={fetchStudents}
              className="mt-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : loading && students.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">Initializing Nodes...</p>
          </div>
        ) : activeTab === 'about' ? (
          <AboutProject />
        ) : (
          <DashboardTable 
            students={students}
            queryResults={queryResults}
            activeQueryText={activeQueryText}
            onClearQuery={() => {
              setQueryResults(null);
              setActiveQueryText(null);
            }}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onResetData={handleResetData}
          />
        )}
      </main>

{activeTab === 'sandbox' && (
        <ChatBot 
          onSyncStudents={handleSyncStudents} 
          isMobileOpen={isChatbotOpen}
          onCloseMobile={() => setIsChatbotOpen(false)}
        />
      )}

{activeTab === 'sandbox' && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 glow-emerald transition-all duration-300 transform hover:scale-110 active:scale-95 animate-[bounce_3s_infinite]"
          title="Toggle Assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default App;
