import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentApi } from '../../api/paymentApi';
import toast from 'react-hot-toast';
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, Receipt, Wallet, Activity } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function MyPayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentApi.getPatientPayments(user.userId);
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-rose-500" />;
      case 'PENDING':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <Clock className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'FAILED':
        return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'REFUNDED':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  // Calculate Summary Data
  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successfulCount = payments.filter(p => p.status === 'SUCCESS').length;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        
        {/* 👋 Header Section */}
        <div className="mb-8 relative p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-200/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center gap-3">
              My <span className="text-[#0D5C58]">Payments</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base">
              View your payment history, invoices, and billing summaries.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border border-teal-50">
            <Wallet className="w-10 h-10 text-teal-600" />
          </div>
        </div>

        {/* 📊 Payment Summary Stats (Moved to Top for better UX) */}
        {payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Invoices</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{payments.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Successful</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{successfulCount}</p>
              </div>
            </div>

            <div className="bg-[#0D5C58] p-6 rounded-[2rem] shadow-lg shadow-teal-900/20 flex items-center gap-5 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-10">
                <DollarSign className="w-7 h-7" />
              </div>
              <div className="z-10">
                <p className="text-[11px] font-bold text-teal-100 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black mt-1">LKR {totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* 🧾 Payments List Section */}
        {payments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <CreditCard className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Payments Found</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              You haven't made any payments yet. Your billing history and invoices will automatically appear here once transactions are processed.
            </p>
          </div>
        ) : (
          /* Payments Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {payments.map((payment) => (
              <div 
                key={payment.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 group flex flex-col"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800 tracking-tight">
                        Invoice #{payment.id}
                      </h3>
                      {payment.appointmentId && (
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                          <Activity className="w-3 h-3" /> Appt ID: {payment.appointmentId}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Amount
                    </p>
                    <p className="text-base font-black text-[#0D5C58]">
                      Rs {payment.amount?.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Method
                    </p>
                    <p className="text-sm font-bold text-gray-700 mt-1">
                      {payment.method || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date
                    </p>
                    <p className="text-sm font-bold text-gray-700 mt-1">
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}