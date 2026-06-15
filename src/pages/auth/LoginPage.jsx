import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/authApi';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔢 Counters mechanical logic (එහෙම්මම තියෙනවා)
  const [emergencyCount, setEmergencyCount] = useState(1);
  const [doctorCount, setDoctorCount] = useState(1);
  const [patientCount, setPatientCount] = useState(1);

  useEffect(() => {
    const duration = 2000; 
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setEmergencyCount(Math.max(1, Math.floor((24 / steps) * currentStep)));
      setDoctorCount(Math.max(1, Math.floor((80 / steps) * currentStep)));
      setPatientCount(Math.max(1, Math.floor((100 / steps) * currentStep)));

      if (currentStep >= steps) {
        setEmergencyCount(24);
        setDoctorCount(80);
        setPatientCount(100);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await loginUser(formData);
      const { token, role, message, userId, fullName } = response.data;
      
      if (token) {
        login({ email: formData.email, role, userId, fullName }, token);
        
        if (role === 'PATIENT') navigate('/patient');
        else if (role === 'DOCTOR') navigate('/doctor');
        else if (role === 'ADMIN') navigate('/admin');
      } else {
        setErrorMsg(message || 'Login failed. Please try again.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Login failed!';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🖥️ No scroll screen frame
    <div className="h-screen w-screen flex flex-col bg-white font-sans antialiased overflow-hidden">
      
      {/* 🌐 1. Top Navigation Bar (Background light green #EBF6F4 - Unchanged) */}
      <header className="w-full bg-[#EBF6F4] px-6 lg:px-16 h-16 flex justify-between items-center border-b border-teal-100 shadow-sm flex-shrink-0 z-20">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-[#0D5C58] text-3xl font-bold">✦</span>
          <span className="text-gray-800 font-extrabold text-2xl tracking-tight">Healthcare</span>
        </div>
        
        <nav className="hidden md:flex space-x-10 text-sm font-semibold text-gray-500">
          <span onClick={() => navigate('/')} className="text-[#0D5C58] cursor-pointer hover:opacity-80">Home</span>
          <span onClick={() => navigate('/about')} className="hover:text-[#0D5C58] transition cursor-pointer">About Us</span>
          <span onClick={() => navigate('/services')} className="hover:text-[#0D5C58] transition cursor-pointer">Service</span>
          <span onClick={() => navigate('/blog')} className="hover:text-[#0D5C58] transition cursor-pointer">Blog</span>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-[#0D5C58] transition">Login</button>
          <button onClick={() => navigate('/register')} className="px-5 py-2.5 bg-[#0D5C58] text-white text-sm font-bold rounded-xl hover:bg-[#094440] transition duration-300 shadow-md">Sign up</button>
        </div>
      </header>

      {/* 🖥️ 2. Main Body Split Dashboard */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-0 overflow-hidden">
        
        {/* Left Side Banner */}
        <div className="w-full lg:w-6/12 bg-gradient-to-br from-[#39A9A4] to-[#0A5652] p-8 lg:p-16 flex flex-col justify-between relative h-full overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#053d3a] opacity-25 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-white text-3xl lg:text-5xl font-black leading-[1.15] tracking-tight mb-4">
              The Best Medical <br />
              and Treatment <br />
              Center for You
            </h1>
            <p className="text-teal-50/80 text-sm max-w-md font-medium leading-relaxed">
              We understand that injuries and acute pain can happen unexpectedly. Our emergency services are always ready.
            </p>
          </div>

          {/* 🩺 🎯 🔄 SLOW SPINNING OUTER CIRCLE WITH STATIC PHOTO (Updated with clean extraction) */}
          <div className="flex justify-center items-center relative z-10 my-auto">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center relative group">
              
              {/* 🔄 1. Outer Dashed Circle - මේක විතරක් පට්ට හෙමින් Smoothව කැරකෙනවා */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-dashed border-teal-300/60 animate-spin"
                style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
              ></div>
              
              {/* 👤 2. Inner Static Doctor Avatar Box - මේක නිශ්චලයි, කැරකෙන්නේ නැහැ */}
              <div className="absolute w-[86%] h-[86%] rounded-full bg-[#063f3c] p-2 flex items-center justify-center shadow-2xl border-4 border-white/10 overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden bg-teal-900/50 border border-teal-400/30 flex items-center justify-center relative">
                  
                  {/* 📸 ඔයා දැන් දීපු අලුත්ම Pinterest Photo එක මෙතනට දැම්මා - හරියටම මැදි කළා */}
                  <img 
                    src="https://i.pinimg.com/736x/b9/00/63/b90063e69027985547d53151a641fe46.jpg" 
                    alt="Doctor Profile Pic" 
                    // object-cover object-center මඟින් පින්තූරය හරියටම මැදි කරනවා
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" // hover scale පොඩ්ඩක් අඩු කළා lassanata fit wenna
                  />

                </div>
                {/* Floating Badge stays fixed */}
                <div className="absolute -bottom-1 -left-1 bg-white p-2.5 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition duration-300">
                  <span className="text-xl">🩺</span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-6 relative z-10 max-w-xl">
            <div>
              <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight">{emergencyCount}/7</h3>
              <p className="text-[11px] text-teal-100 font-semibold mt-0.5 uppercase tracking-wider">Emergency Service</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight">{doctorCount}+</h3>
              <p className="text-[11px] text-teal-100 font-semibold mt-0.5 uppercase tracking-wider">Specialist Doctor</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <h3 className="text-white text-2xl lg:text-3xl font-black tracking-tight">{patientCount}k+</h3>
              <p className="text-[11px] text-teal-100 font-semibold mt-0.5 uppercase tracking-wider">Happy Patient</p>
            </div>
          </div>
        </div>

        {/* 🔵 Right Side - Login Box (Loku කරපු එක එහෙම්මමයි - Unchanged) */}
        <div className="w-full lg:w-6/12 flex flex-col justify-center items-center p-8 lg:p-16 bg-gradient-to-br from-[#F3FAF8] to-[#E1F2EE] h-full">
          <div className="w-full max-w-xl bg-white p-10 lg:p-14 rounded-[3rem] border border-white/80 shadow-md">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-gray-800 tracking-tight">Welcome Back</h3>
              <p className="text-sm text-gray-400 mt-1">Please secure sign in to your dashboard</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-xs text-red-600 font-bold rounded-r-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C58] transition duration-300 text-base font-medium text-gray-700 shadow-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C58] transition duration-300 text-base font-medium text-gray-700 shadow-sm"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <a href="#" className="text-xs text-[#0D5C58] font-bold hover:underline">Forgot password?</a>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0D5C58] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#094440] transition duration-300 shadow-xl active:scale-[0.99] transform"
              >
                {loading ? 'Verifying Account...' : 'Secure Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8 font-semibold">
              Don't have an account? 
              <span 
                onClick={() => navigate('/register')} 
                className="text-[#0D5C58] font-bold cursor-pointer hover:underline pl-1"
              >
                Sign Up Now
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}