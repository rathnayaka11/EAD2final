import { useState, useEffect } from 'react';
import { paymentApi } from '../../api/paymentApi';
import toast from 'react-hot-toast';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock, Search, Filter, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AllPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentApi.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId) => {
    try {
      await paymentApi.verifyPayment(paymentId);
      toast.success('Payment verified successfully');
      fetchPayments();
    } catch (error) {
      toast.error('Failed to verify payment');
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
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id?.toString().includes(searchTerm) ||
                          payment.appointmentId?.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen font-sans antialiased bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        
        {/* 🛡️ Admin Header Section */}
        <div className="mb-8 relative p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                All <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Payments</span>
              </h1>
            </div>
            <p className="text-slate-400 font-medium text-sm md:text-base ml-11">
              Monitor all system transactions, verify pending dues, and track revenue.
            </p>
          </div>

          <div className="relative z-10 flex gap-3">
            <button onClick={fetchPayments} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all border border-white/10 text-sm">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* 📊 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Payments</p>
            <h3 className="text-3xl font-black text-gray-800 relative z-10">{payments.length}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Successful</p>
            <h3 className="text-3xl font-black text-emerald-600 relative z-10">{payments.filter(p => p.status === 'SUCCESS').length}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Pending</p>
            <h3 className="text-3xl font-black text-amber-600 relative z-10">{payments.filter(p => p.status === 'PENDING').length}</h3>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-800 relative z-10 flex items-center gap-1">
              <span className="text-sm text-gray-400">LKR</span>
              {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>

        {/* 🔍 Search & Filters */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Payment ID or Appointment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* 🧾 Data Table */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center shadow-sm min-h-[300px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <CreditCard className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">No Payments Found</h2>
            <p className="text-gray-500 font-medium max-w-sm">
              Try adjusting your search or filter to find the transactions you're looking for.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Payment ID</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Appt ID</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-black text-gray-800">#{payment.id}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">#{payment.appointmentId}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-black text-gray-800">
                            {payment.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-600 bg-slate-100 px-3 py-1 rounded-lg">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-600">
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm">
                        {payment.status === 'PENDING' ? (
                          <button
                            onClick={() => handleVerify(payment.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 hover:scale-105 transition-all font-bold"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 font-medium text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}