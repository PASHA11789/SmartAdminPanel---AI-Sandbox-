import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Filter, 
  X, 
  Check, 
  AlertCircle,
  Users,
  Sparkles
} from 'lucide-react';

const DashboardTable = ({ students, queryResults, activeQueryText, onClearQuery, onAddStudent, onEditStudent, onDeleteStudent, onResetData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [classFilter, setClassFilter] = useState('All');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [infoOpen, setInfoOpen] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    studentClass: '',
    section: '',
    attendanceStatus: 'Absent',
    balance: 0
  });
  const [formError, setFormError] = useState('');

  // Extract unique classes for the class filter
  const uniqueClasses = ['All', ...new Set(students.map(s => s.studentClass))];

  // Determine active student list (full sandbox or filtered by AI query results)
  const activeStudentList = queryResults !== null ? queryResults : students;

  // Filtering students
  const filteredStudents = activeStudentList.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.includes(searchTerm) ||
      student.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || student.attendanceStatus === statusFilter;
    const matchesClass = classFilter === 'All' || student.studentClass === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      rollNo: '',
      name: '',
      studentClass: '',
      section: '',
      attendanceStatus: 'Absent',
      balance: 0
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      rollNo: student.rollNo,
      name: student.name,
      studentClass: student.studentClass,
      section: student.section,
      attendanceStatus: student.attendanceStatus,
      balance: student.balance !== undefined ? student.balance : 0
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.rollNo || !formData.name || !formData.studentClass || !formData.section) {
      setFormError('All fields are required.');
      return;
    }

    // Check duplicate rollNo locally before calling parent
    const exists = students.some(s => s.rollNo === formData.rollNo);
    if (exists) {
      setFormError(`Student with Roll No ${formData.rollNo} already exists.`);
      return;
    }

    const success = await onAddStudent(formData);
    if (success) {
      setIsAddModalOpen(false);
    } else {
      setFormError('Failed to add student. Roll number might already exist.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.rollNo || !formData.name || !formData.studentClass || !formData.section) {
      setFormError('All fields are required.');
      return;
    }

    // Check duplicate rollNo locally
    const exists = students.some(s => s.rollNo === formData.rollNo && s._id !== currentStudent._id);
    if (exists) {
      setFormError(`Student with Roll No ${formData.rollNo} already exists.`);
      return;
    }

    const success = await onEditStudent(currentStudent._id, formData);
    if (success) {
      setIsEditModalOpen(false);
    } else {
      setFormError('Failed to update student.');
    }
  };

  // Metrics calculations
  const totalStudents = students.length;
  const presentToday = students.filter(s => s.attendanceStatus === 'Present').length;
  const absentToday = students.filter(s => s.attendanceStatus === 'Absent').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" /> Admin Sandbox
          </h2>
          <p className="text-slate-600 text-sm font-semibold">
            Manage student records and track attendance status in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" /> Add Student Record
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-1 font-mono shadow-sm">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Total Students</span>
          <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-1 font-mono shadow-sm">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Present Today</span>
          <span className="text-3xl font-extrabold text-emerald-600">{presentToday}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-1 font-mono shadow-sm">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Absent</span>
          <span className="text-3xl font-extrabold text-rose-600">{absentToday.toString().padStart(2, '0')}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col gap-1 justify-between shadow-sm">
          <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>Attendance Rate</span>
            <span>{attendanceRate}%</span>
          </div>
          <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${attendanceRate}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Active Query Banner */}
      {activeQueryText && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-850 rounded-2xl flex items-center justify-between shadow-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Showing AI Query results for: <span className="font-mono text-emerald-950 font-bold">"{activeQueryText}"</span></span>
          </div>
          <button 
            onClick={onClearQuery}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-md shadow-emerald-500/10 active:scale-95 duration-200"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Name, Roll No, or Class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            <option value="All">All Attendance Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Class Filter */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
          >
            <option value="All">All Classes</option>
            {uniqueClasses.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-800/80 shadow-md">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-24">Roll No</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-36">Class</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-28">Section</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-36">Attendance</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-36">Balance</th>
                <th className="px-6 py-4.5 text-[10px] font-bold text-slate-200 uppercase tracking-wider w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isPresent = student.attendanceStatus === 'Present';
                  return (
                    <tr 
                      key={student._id} 
                      className="hover:bg-slate-900/20 transition-colors group"
                    >
                      <td className="px-6 py-4.5 text-sm font-semibold text-indigo-300 font-mono">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4.5 text-sm font-semibold text-slate-100">
                        {student.name}
                      </td>
                      <td className="px-6 py-4.5 text-sm text-slate-200">
                        {student.studentClass}
                      </td>
                      <td className="px-6 py-4.5 text-sm text-slate-200">
                        <span className="px-2.5 py-1 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-semibold text-slate-200">
                          {student.section}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          isPresent 
                            ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20 glow-emerald' 
                            : 'text-rose-400 bg-rose-950/20 border-rose-500/20 glow-rose'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
                          {student.attendanceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-sm font-semibold text-slate-100 font-mono">
                        ${(student.balance !== undefined ? student.balance : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4.5 text-sm text-right">
                        <div className="flex items-center justify-end gap-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-300 border border-transparent hover:border-slate-700 transition-all"
                            title="Edit Student"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student._id)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 border border-transparent hover:border-slate-700 transition-all"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center text-slate-300">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-10 h-10 text-slate-400" />
                      <p className="text-sm font-semibold">No student records found matching filters.</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or use the chatbot to query the database.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 flex justify-between items-center text-xs text-slate-300">
          <p>Showing {filteredStudents.length} of {students.length} student records</p>
          <p className="font-mono">Database Status: Connected</p>
        </div>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Add Student Record</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 101"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</label>
                  <input
                    type="text"
                    name="studentClass"
                    required
                    value={formData.studentClass}
                    onChange={handleInputChange}
                    placeholder="e.g. Class 10"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section</label>
                  <input
                    type="text"
                    name="section"
                    required
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g. A"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Status</label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'Present' }))}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        formData.attendanceStatus === 'Present'
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'Absent' }))}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        formData.attendanceStatus === 'Absent'
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-400 shadow-md shadow-rose-500/5'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance ($)</label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    placeholder="e.g. 150"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500  text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/15"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Modify Student Record</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 flex flex-col gap-4">
              {formError && (
                <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    placeholder="e.g. 101"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class</label>
                  <input
                    type="text"
                    name="studentClass"
                    required
                    value={formData.studentClass}
                    onChange={handleInputChange}
                    placeholder="e.g. Class 10"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section</label>
                  <input
                    type="text"
                    name="section"
                    required
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g. A"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Status</label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'Present' }))}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        formData.attendanceStatus === 'Present'
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'Absent' }))}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        formData.attendanceStatus === 'Absent'
                          ? 'bg-rose-950/20 border-rose-500/40 text-rose-400 shadow-md shadow-rose-500/5'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance ($)</label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    placeholder="e.g. 150"
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-500 hover:to-teal-555 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-emerald-500/15"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTable;
