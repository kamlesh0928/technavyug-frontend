import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { studentService } from "@/services/student.services";
import ProductCard from "@/components/ui/ProductCard";
import ProductDetailModal from "@/components/ui/ProductDetailModal";
import {
  LuSearch,
  LuPackage,
  LuSlidersHorizontal,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuShoppingCart,
  LuSparkles,
} from "react-icons/lu";
import { useDispatch } from "react-redux";
import { addToCart, openCart } from "@/store/Slices/cartSlice";

const TYPE_OPTIONS = ["All", "Digital", "Physical", "Service"];

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Filter + pagination state
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products (public endpoint — no auth needed)
  const { data, isLoading } = useQuery({
    queryKey: ["public-products", { search, type, page }],
    queryFn: () =>
      studentService.getProducts({
        search: search || undefined,
        type: type || undefined,
        status: "Active",
        page,
        limit: 12,
      }),
    keepPreviousData: true,
  });

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  const hasFilters = search || type;

  const clearFilters = useCallback(() => {
    setSearch("");
    setType("");
    setPage(1);
  }, []);

  // Called when user clicks "Buy" or "Add to Cart"
  const handleAddToCart = useCallback(
    (product) => {
      if (!user) {
        // Save current path so login can redirect back here
        navigate("/login", {
          state: { from: location.pathname },
        });
        return;
      }
      // Logged in — add to cart and open drawer
      dispatch(addToCart(product));
      dispatch(openCart());
    },
    [user, navigate, location.pathname, dispatch]
  );

  return (
    <div className="pt-[72px]">
      {/* ── Hero Header ── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#0f2c59] via-[#1a4073] to-[#0e3a82] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <LuSparkles size={12} /> Technavyug Digital Store
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Discover Premium{" "}
              <span className="text-cyan-400">Digital Products</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              From digital assets to physical goods — find exactly what you need
              to accelerate your journey.
            </p>
          </div>

          {/* Stats bar */}
          {!isLoading && products.length > 0 && (
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <LuPackage size={16} className="text-cyan-400" />
                <span>
                  <strong className="text-white">{pagination.total || products.length}</strong> products
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <LuShoppingCart size={16} className="text-cyan-400" />
                <span>Instant digital delivery</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Filters + Grid ── */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8 items-start md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <LuSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Type Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <LuSlidersHorizontal size={16} className="text-gray-400 flex-shrink-0" />
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t === "All" ? "" : t);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    (t === "All" && !type) || type === t
                      ? "bg-[#0f2c59] text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-1 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-all"
                >
                  <LuX size={12} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ── Product Grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-gray-100 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                      <div className="h-8 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-gray-400">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                <LuPackage size={40} className="opacity-40" />
              </div>
              <p className="text-xl font-bold text-gray-600 mb-1">
                No products found
              </p>
              <p className="text-sm mb-6">
                {hasFilters
                  ? "Try adjusting your filters."
                  : "No products have been added yet."}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDetailClick={setSelectedProduct}
                  onBuyClick={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
              >
                <LuChevronLeft size={18} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    page === i + 1
                      ? "bg-[#0f2c59] text-white shadow-blue-900/20"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 shadow-sm transition-all"
              >
                <LuChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Login prompt banner — shown only if not logged in */}
          {!user && products.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-[#0f2c59] to-blue-700 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/20">
              <div>
                <p className="text-white font-black text-xl mb-1">
                  Ready to make a purchase?
                </p>
                <p className="text-blue-200 text-sm">
                  Login to your account to buy products and track your orders.
                </p>
              </div>
              <button
                onClick={() =>
                  navigate("/login", { state: { from: location.pathname } })
                }
                className="flex-shrink-0 flex items-center gap-2 bg-white text-[#0f2c59] px-8 py-3 rounded-2xl font-black text-sm hover:shadow-lg active:scale-95 transition-all"
              >
                <LuShoppingCart size={16} /> Login to Buy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuy={handleAddToCart}
          isLoggedIn={!!user}
        />
      )}
    </div>
  );
}
