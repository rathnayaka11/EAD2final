import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { prescriptionApi } from '../../api/prescriptionApi';
import toast from 'react-hot-toast';
import { FileText, Calendar, Pill, Stethoscope, Activity, ClipboardList, Info, Syringe } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await prescriptionApi.getPatientPrescriptions(user.userId);
      setPrescriptions(response.data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
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
              My <span className="text-[#0D5C58]">Prescriptions</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
              View and manage your medical prescriptions and doctor's instructions.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border border-teal-50">
            <ClipboardList className="w-10 h-10 text-teal-600" />
          </div>
        </div>

        {/* 📋 Content Section */}
        {prescriptions.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-teal-50 rounded-[2rem] flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Prescriptions Yet</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              You don't have any medical prescriptions at the moment. They will appear here automatically after your consultations.
            </p>
          </div>
        ) : (
          /* Prescriptions Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <div 
                key={prescription.id} 
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 group flex flex-col"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#F3FAF8] rounded-2xl flex items-center justify-center text-[#0D5C58] shadow-sm border border-teal-50">
                      <Pill className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-800 tracking-tight">
                        Prescription #{prescription.id}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 
                        {prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Doctor & Appt Info Row */}
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-bold text-gray-700">Dr. {prescription.doctorName || 'Specialist'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-bold text-gray-600">Appt #{prescription.appointmentId}</span>
                  </div>
                </div>

                {/* Medical Details Blocks */}
                <div className="space-y-4 flex-grow">
                  
                  {/* Diagnosis */}
                  {prescription.diagnosis && (
                    <div className="bg-blue-50/50 border border-blue-100/50 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-full -mr-8 -mt-8 blur-xl"></div>
                      <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 relative z-10">
                        <Activity className="w-3.5 h-3.5" /> Diagnosis
                      </h4>
                      <p className="text-sm font-medium text-gray-700 relative z-10">{prescription.diagnosis}</p>
                    </div>
                  )}

                  {/* Medications */}
                  {prescription.medications && (
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-slate-200/50 rounded-full -mr-8 -mt-8 blur-xl"></div>
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 relative z-10">
                        <Syringe className="w-3.5 h-3.5" /> Medications
                      </h4>
                      <p className="text-sm font-medium text-gray-800 whitespace-pre-line leading-relaxed relative z-10">
                        {prescription.medications}
                      </p>
                    </div>
                  )}

                  {/* Instructions */}
                  {prescription.instructions && (
                    <div className="bg-emerald-50/50 border border-emerald-100/50 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100/50 rounded-full -mr-8 -mt-8 blur-xl"></div>
                      <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5 relative z-10">
                        <Info className="w-3.5 h-3.5" /> Instructions
                      </h4>
                      <p className="text-sm font-medium text-gray-700 relative z-10">{prescription.instructions}</p>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}