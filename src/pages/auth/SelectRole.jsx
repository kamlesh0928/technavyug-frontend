import { useState } from "react";
import { LuUser, LuGraduationCap } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserRole } from "@/api/authApi";
import { setUser } from "@/store/Slices/authSlice";

export default function SelectRole() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    try {
      setIsLoading(true);
      const response = await updateUserRole(selectedRole);
      
      // Update Redux state with new user object
      dispatch(setUser(response.user));
      
      toast.success(`Successfully joined as ${selectedRole}!`);
      
      // Redirect to the right dashboard
      if (selectedRole === "Student") navigate("/student");
      else if (selectedRole === "Instructor") navigate("/instructor");
      else navigate("/");
      
    } catch (error) {
      console.error("Role Selection Error:", error);
      toast.error(error.response?.data?.message || "Failed to update role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If user isn't logged in, or already has a real role, they shouldn't be here
  if (!user || (user.role !== "Guest" && user.role !== undefined)) {
    // We render a small fallback or auto-redirect
    setTimeout(() => navigate("/"), 100);
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
        
        <div className="flex justify-center mb-10">
          <Link to="/" className="text-3xl font-extrabold tracking-tight">
            Tech<span className="text-cyan-500">navyug</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-sm font-bold tracking-wider uppercase mb-4 border border-cyan-100">
            Almost There
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            How would you like to <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">join us?</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mx-auto">
            Choose your path to personalize your Technavyug experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Student Card */}
          <button
            onClick={() => setSelectedRole("Student")}
            className={`relative group text-left p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 ${
              selectedRole === "Student"
                ? "border-cyan-500 bg-cyan-50/50 shadow-lg shadow-cyan-100"
                : "border-slate-100 bg-white hover:border-cyan-200 hover:bg-slate-50"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              selectedRole === "Student" ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-cyan-100 group-hover:text-cyan-600"
            }`}>
              <LuUser size={28} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 transition-colors ${
              selectedRole === "Student" ? "text-cyan-900" : "text-slate-800"
            }`}>
              I'm a Student
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              I want to learn new skills, enroll in courses, and build my career.
            </p>
            
            {selectedRole === "Student" && (
              <div className="absolute top-6 right-6 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center animate-in zoom-in">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>

          {/* Instructor Card */}
          <button
            onClick={() => setSelectedRole("Instructor")}
            className={`relative group text-left p-6 md:p-8 rounded-3xl border-2 transition-all duration-300 ${
              selectedRole === "Instructor"
                ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100"
                : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              selectedRole === "Instructor" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}>
              <LuGraduationCap size={28} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 transition-colors ${
              selectedRole === "Instructor" ? "text-blue-900" : "text-slate-800"
            }`}>
              I'm an Instructor
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              I want to share my knowledge, create courses, and inspire others.
            </p>
            
            {selectedRole === "Instructor" && (
              <div className="absolute top-6 right-6 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className={`w-full md:w-auto min-w-[200px] px-8 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              selectedRole
                ? "bg-[#0f172a] text-white shadow-xl shadow-slate-200 hover:bg-[#1e293b] hover:shadow-2xl active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
