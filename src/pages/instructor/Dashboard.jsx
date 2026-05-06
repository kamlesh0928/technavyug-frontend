import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { studentService } from "@/services/student.services";
import { authService } from "@/services/auth.services";
import {
  LuBookOpen,
  LuUsers,
  LuDollarSign,
  LuTrendingUp,
  LuPlus,
  LuArrowRight,
  LuCalendar,
  LuTrash2,
  LuLock,
  LuPackage,
} from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { addToCart, openCart } from "@/store/Slices/cartSlice";
import { useDispatch } from "react-redux";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetailModal from "@/components/ui/ProductDetailModal";

export default function InstructorDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [showDelete, setShowDelete] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        navigate("/login");
        return;
      }
      dispatch(addToCart(product));
      dispatch(openCart());
    },
    [user, navigate, dispatch]
  );

  const handleBuyNow = useCallback(
    (product) => {
      if (!user) {
        navigate("/login");
        return;
      }
      navigate("/student/checkout", { state: { buyNowItem: { ...product, quantity: 1 } } });
    },
    [user, navigate]
  );

  const handleDeleteAccount = async () => {
    if (!confirmPassword) return toast.error("Password is required");
    setIsDeleting(true);
    try {
      await authService.deleteAccount(confirmPassword);
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.userMessage || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-courses", user?.id],
    queryFn: () => studentService.getCourses({ instructorId: user?.id }),
    enabled: !!user?.id,
  });

  // Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: () => studentService.getProducts(),
  });
  const products = productsData?.data || [];

  const courses = data?.data || [];
  const totalStudents = courses.reduce(
    (acc, c) => acc + (c.totalEnrollments || 0),
    0,
  );
  const totalRevenue = courses.reduce(
    (acc, c) => acc + (parseFloat(c.price) || 0) * (c.totalEnrollments || 0),
    0,
  );

  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: LuBookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: LuUsers,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: LuDollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your teaching portfolio and student engagement
          </p>
        </div>
        <Link
          to="/instructor/courses/new"
          className="flex items-center gap-2 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all w-fit"
        >
          <LuPlus size={18} /> Create New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}
            >
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Courses */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <LuBookOpen className="text-blue-500" size={18} />
              Recent Courses
            </h3>
            <Link
              to="/instructor/courses"
              className="text-sm font-bold text-gray-400 hover:text-cyan-600 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center">
                <LuBookOpen size={48} className="text-gray-100 mb-4" />
                <p className="text-gray-400 font-bold">
                  No courses created yet.
                </p>
                <Link
                  to="/instructor/courses/new"
                  className="text-cyan-600 text-sm font-bold mt-2 hover:underline"
                >
                  Start teaching today
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {courses.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/instructor/courses`)}
                    className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={
                            c.thumbnail ||
                            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                          <span className="flex items-center gap-1">
                            <LuUsers size={10} /> {c.totalEnrollments} Students
                          </span>
                          <span className="flex items-center gap-1">
                            <LuTrendingUp size={10} /> {c.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${c.status === "Published" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}
                      >
                        {c.status}
                      </span>
                      <LuArrowRight
                        className="text-gray-300 group-hover:text-blue-900 transition-colors"
                        size={16}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats or News */}
        <div className="space-y-8">
          <div className="bg-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <LuTrendingUp className="text-cyan-400 mb-6" size={32} />
            <h4 className="text-xl font-bold mb-2">Growth Center</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Learn how to double your course engagement with our expert tips.
            </p>
            <button className="flex items-center gap-2 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest">
              Level Up <LuArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                <LuCalendar size={20} />
              </div>
              <h4 className="font-bold text-gray-900">Upcoming Updates</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Coming Next Week
                </p>
                <p className="text-sm font-bold text-gray-800">
                  Advanced Analytics Dashboard
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl opacity-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  In Development
                </p>
                <p className="text-sm font-bold text-gray-800">
                  Live Workshop Integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Marketplace */}
      <div className="mt-12 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <LuPackage className="text-blue-500" /> Digital Marketplace
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Explore our collection of digital assets and community products
            </p>
          </div>
          <Link
            to="#"
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View All Products
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isProductsLoading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse"
              >
                <div className="bg-gray-100 aspect-[4/3] rounded-xl" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-8 bg-gray-100 rounded w-full mt-2" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 py-12 flex flex-col items-center justify-center text-gray-400">
              <LuPackage size={40} className="mb-3 opacity-20" />
              <p className="text-md font-bold">No products available</p>
            </div>
          ) : (
            products
              .slice(0, 4)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onDetailClick={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isLoggedIn={!!user}
        />
      )}

      {/* Danger Zone */}
      <div className="bg-red-50/30 rounded-3xl border border-red-100 overflow-hidden w-full max-w-4xl mt-12 mb-8">
        <div className="px-8 py-6 border-b border-red-100 flex items-center gap-3 text-red-600">
          <LuTrash2 size={24} />
          <h3 className="font-bold">Danger Zone</h3>
        </div>
        <div className="p-8">
          <p className="font-bold text-gray-900 mb-1">Delete Account</p>
          <p className="text-sm text-gray-500 mb-6">
            Permanently remove your instructor account, all your courses and
            associated data. This action cannot be undone.
          </p>

          {showDelete ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 max-w-md">
              <div className="relative">
                <LuLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="password"
                  placeholder="Confirm password to delete"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-red-200 text-sm outline-none focus:ring-2 focus:ring-red-400 transition-all font-medium text-gray-800"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || !confirmPassword}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-600/20 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDelete(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 active:scale-95 transition-all w-full md:w-auto"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
