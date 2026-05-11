import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LuTag, LuTrash2, LuLoader, LuShield, LuChevronRight, LuBookOpen, LuClock } from "react-icons/lu";

export default function CoursePurchase() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [paying, setPaying] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["course-purchase", courseId],
    queryFn: async () => {
      // Fetch course by ID (we can use the courses endpoint)
      const response = await studentService.getCourses({ id: courseId });
      return response;
    },
    enabled: !!courseId,
  });

  // Try to find the course from the response
  const courses = data?.data || [];
  const course = Array.isArray(courses) ? courses.find((c) => c.id === courseId) : courses;

  const couponMutation = useMutation({
    mutationFn: (d) => studentService.validateCoupon(d),
    onSuccess: (res) => {
      setCouponResult(res.data);
      toast.success("Coupon applied");
    },
    onError: (err) => {
      setCouponResult(null);
      toast.error(err?.data?.message || err?.userMessage || "Invalid coupon");
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim() || !course) return;
    couponMutation.mutate({
      code: couponCode,
      subtotal: parseFloat(course.price),
      applicableTo: "course",
    });
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

  const price = course ? parseFloat(course.price) : 0;
  const discountAmount = couponResult?.discountAmount || 0;
  const finalAmount = Math.max(0, price - discountAmount);

  const handlePay = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/student/purchase-course/${courseId}` } });
      return;
    }
    setPaying(true);
    try {
      const payload = {
        courseId,
        couponCode: couponResult ? couponCode : undefined,
      };
      const res = await studentService.initiateCoursePurchase(payload);
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else if (res.data?.paid === false) {
        // Coupon covered the full amount
        toast.success(res.message || "Course enrolled successfully");
        navigate("/student/courses");
      } else {
        toast.error("Could not get payment URL");
        setPaying(false);
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.userMessage || "Payment initiation failed");
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LuLoader size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Purchase Course</h1>

        {/* Course Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="flex gap-4">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#0f2c59] to-blue-700 flex items-center justify-center flex-shrink-0">
                <LuBookOpen size={32} className="text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 line-clamp-2">{course.title}</h2>
              {course.instructor && <p className="text-sm text-gray-500 mt-1">by {course.instructor.name}</p>}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><LuBookOpen size={12} /> {course.totalLectures || 0} lectures</span>
                <span className="flex items-center gap-1"><LuClock size={12} /> {Math.round((course.totalDuration || 0) / 3600)}h</span>
                <span>{course.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
            <LuTag size={16} className="text-[#0f2c59]" /> Have a coupon?
          </h3>
          {couponResult ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-bold text-green-700">{couponResult.code} applied</p>
                <p className="text-xs text-green-600">You save Rs. {couponResult.discountAmount}</p>
              </div>
              <button onClick={removeCoupon} className="text-red-500 hover:text-red-700"><LuTrash2 size={16} /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none uppercase tracking-wider" />
              <button onClick={handleApplyCoupon} disabled={couponMutation.isPending || !couponCode.trim()}
                className="px-6 py-3 rounded-xl bg-[#0f2c59] text-white text-sm font-bold hover:bg-blue-800 disabled:opacity-50 transition-all">
                {couponMutation.isPending ? <LuLoader size={14} className="animate-spin" /> : "Apply"}
              </button>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Course Price</span>
              <span className="font-bold text-gray-900">Rs. {price.toFixed(0)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Coupon Discount</span>
                <span className="font-bold text-green-600">-Rs. {discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-base pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-gray-900 text-xl">Rs. {finalAmount.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button onClick={handlePay} disabled={paying}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98] transition-all text-sm disabled:opacity-50">
          {paying ? (
            <><LuLoader size={18} className="animate-spin" /> Processing...</>
          ) : (
            <>{finalAmount <= 0 ? "Enroll Now (Free)" : "Pay with PhonePe"} <LuChevronRight size={16} /></>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
          <LuShield size={12} /> Secure payment via PhonePe
        </p>
      </div>
    </div>
  );
}
