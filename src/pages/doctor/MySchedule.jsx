import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi } from '../../api/appointmentApi';
import toast from 'react-hot-toast';
import { Calendar, Clock, Plus, X, CalendarDays, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MySchedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await appointmentApi.getDoctorSchedules(user.userId);
      setSchedules(response.data);
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const scheduleData = {
        doctorId: user.userId,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00',
      };

      await appointmentApi.addSchedule(scheduleData);
      toast.success('Schedule added successfully!');
      setShowForm(false);
      setFormData({ dayOfWeek: 'MONDAY', startTime: '', endTime: '' });
      fetchSchedules();
    } catch (error) {
      toast.error('Failed to add schedule');
    }
  };

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  // Helper to format MONDAY -> Monday
  const formatDay = (day) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* 👋 Header Section */}
        <div className="mb-10 relative p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              My <span className="text-[#0D5C58]">Schedule</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
              Set and manage your weekly availability for patient appointments.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg ${
                showForm 
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100/50' 
                  : 'bg-[#0D5C58] text-white hover:bg-teal-800 shadow-teal-900/20'
              }`}
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{showForm ? 'Cancel' : 'Add Schedule'}</span>
            </button>
          </div>
        </div>

        {/* 📝 Add Schedule Form */}
        {showForm && (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-10 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl"></div>
            
            <h2 className="text-xl font-black text-gray-800 mb-6 relative z-10">Create New Schedule</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Day Select */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Day of Week
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <select
                      name="dayOfWeek"
                      value={formData.dayOfWeek}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-medium text-gray-700 appearance-none"
                      required
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{formatDay(day)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-medium text-gray-700"
                      required
                    />
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    End Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none font-medium text-gray-700"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-50">
                <button 
                  type="submit" 
                  className="bg-[#0D5C58] text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-2"
                >
                  Save Schedule <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 📅 Schedules Grid */}
        {schedules.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Schedules Found</h2>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              You haven't added any working hours yet. Click the "Add Schedule" button above to set your availability.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div 
                key={schedule.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#F3FAF8] rounded-2xl flex items-center justify-center text-[#0D5C58] shadow-sm border border-teal-50 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">
                      {formatDay(schedule.dayOfWeek)}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      Weekly Routine
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 mt-auto">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="font-black text-gray-700 tracking-wide text-sm md:text-base">
                    {schedule.startTime} <span className="text-gray-400 font-medium mx-1">to</span> {schedule.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}