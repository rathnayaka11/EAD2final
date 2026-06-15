import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { doctorApi } from "../../api/doctorApi";
import { User, Stethoscope, DollarSign, Save } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function DoctorProfile() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    fee: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await doctorApi.getDoctorById(user.userId);
      setDoctor({
        name: res.data.name || "",
        specialization: res.data.specialization || "",
        fee: res.data.fee || "",
      });
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setMessage("");
      await doctorApi.updateDoctor(user.userId, {
        name: doctor.name,
        specialization: doctor.specialization,
        fee: parseFloat(doctor.fee) || 0.0,
      });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data);
      setMessage("❌ Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 p-8 rounded-[2.5rem] bg-gradient-to-r from-[#EBF6F4] to-[#F3FAF8] border border-teal-100/50 shadow-sm">
          <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-1">
            Doctor Profile
          </p>
          <h1 className="text-3xl font-black text-gray-800">
            Manage Your Professional Details
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Update your consultation fee and specialization.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">

          {/* Success / Error Message */}
          {message && (
            <div className={`p-3 rounded-xl text-sm font-semibold text-center ${
              message.startsWith("✅") 
                ? "bg-emerald-50 text-emerald-700" 
                : "bg-rose-50 text-rose-700"
            }`}>
              {message}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={doctor.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4" /> Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={doctor.specialization}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Fee */}
          <div>
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4" /> Consultation Fee (Rs)
            </label>
            <input
              type="number"
              name="fee"
              value={doctor.fee}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 bg-[#0D5C58] text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}