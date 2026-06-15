import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth(); // 💡 ඔයාගේ Auth Context එකේ loading ස්ටේට් එකක් තියෙනවා නම් මෙතනට ගන්න

  // 1️⃣ Auth ඩේටා ලෝඩ් වෙනකන් (උදා: localStorage කියවනකන්) පොඩ්ඩක් ඉන්න සෙට් කරනවා
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0D5C58] border-t-transparent"></div>
      </div>
    );
  }

  // 2️⃣ යූසර් කෙනෙක් ඇත්තටම නැත්නම් හෝ හිස් Object එකක් නම් කෙළින්ම /login එකට රීඩිරෙක්ට් කරනවා (replace=true දාලා)
  if (!user || Object.keys(user).length === 0) {
    console.log("🔴 ProtectedRoute: No valid user found. Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ රෝල් එක කැපිටල්/සිම්පල් කේස් අවුලක් නොවෙන්න චෙක් කරනවා
  if (role && user.role?.toUpperCase() !== role.toUpperCase()) {
    console.log(`🔴 ProtectedRoute: Role mismatch! Expected: ${role}, Got: ${user.role}`);
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ හැමදේම හරි නම් විතරක් ඩෑෂ්බෝඩ් එක පෙන්වනවා
  return <Outlet />;
}