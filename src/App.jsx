import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from './components/common/ProtectedRoute';

// 🔐 Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// 👤 Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyPayments from './pages/patient/MyPayments';
// Note: පේෂන්ට් ප්‍රෙස්ක්‍රිප්ෂන් පේජ් එකක් හැදුවොත් මෙතනට ඉම්පෝර්ට් කරන්න මචං

// 🩺 Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import MySchedule from './pages/doctor/MySchedule';
import PatientAppointments from './pages/doctor/PatientAppointments';
import WritePrescription from './pages/doctor/WritePrescription';
import DoctorProfile from './pages/doctor/DoctorProfile';

// ⚙️ Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* 🌐 Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 👤 Protected Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute role="PATIENT" />}>
            {/* http://localhost:5173/patient (ප්‍රධාන ඩෑෂ්බෝඩ් එක) */}
            <Route index element={<PatientDashboard />} />
            
            {/* http://localhost:5173/patient/book */}
            <Route path="book" element={<BookAppointment />} />
            
            {/* http://localhost:5173/patient/appointments */}
            <Route path="appointments" element={<MyAppointments />} />
            
            {/* http://localhost:5173/patient/payments */}
            <Route path="payments" element={<MyPayments />} />
          </Route>

          {/* 🩺 Protected Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute role="DOCTOR" />}>
            {/* http://localhost:5173/doctor */}
            <Route index element={<DoctorDashboard />} />
            
            {/* http://localhost:5173/doctor/schedule */}
            <Route path="schedule" element={<MySchedule />} />
            
            {/* http://localhost:5173/doctor/appointments */}
            <Route path="appointments" element={<PatientAppointments />} />
            
            {/* http://localhost:5173/doctor/prescriptions/write */}
            <Route path="prescriptions/write" element={<WritePrescription />} />
            
            {/* http://localhost:5173/doctor/profile */}
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* ⚙️ Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="ADMIN" />}>
            {/* http://localhost:5173/admin */}
            <Route index element={<AdminDashboard />} />
            
            {/* http://localhost:5173/admin/users */}
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* 🔄 Default Route (කෙළින්ම ලොජින් එකට රීඩිරෙක්ට් වෙනවා) */}
          <Route path="/" element={<Navigate to="/login" />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}