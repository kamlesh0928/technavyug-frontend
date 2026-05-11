import { useState, useEffect, useCallback } from "react";
import {
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuShoppingCart,
  LuPackage,
  LuTag,
  LuBoxes,
  LuZap,
  LuImage,
} from "react-icons/lu";
import { parseImages } from "@/utils/helpers";

const FALLBACK = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800";

const TYPE_COLORS = {
  Digital: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Physical: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Service: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
};

export default function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow, isLoggedIn }) {
  const images = parseImages(product?.images);
  const allImages = images.length > 0 ? images : [FALLBACK];
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);


  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
      if (e.key === "ArrowRight") setActiveIdx((i) => (i + 1) % allImages.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allImages.length, onClose]);

  const prev = useCallback(() => setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length), [allImages.length]);
  const next = useCallback(() => setActiveIdx((i) => (i + 1) % allImages.length), [allImages.length]);

  const typeColor = TYPE_COLORS[product?.type] || TYPE_COLORS.Digital;

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all"
        >
          <LuX size={18} />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* ── Left: Image Gallery ── */}
          <div className="md:w-[55%] bg-gray-50 flex flex-col min-h-0">
            {/* Main image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[420px] bg-gray-100">
              <img
                key={activeIdx}
                src={imgError[activeIdx] ? FALLBACK : allImages[activeIdx]}
                alt={product.name}
                onError={() => setImgError((p) => ({ ...p, [activeIdx]: true }))}
                onClick={() => setIsZoomed(!isZoomed)}
                className={`max-h-full max-w-full object-contain transition-all duration-300 cursor-zoom-in select-none ${isZoomed ? "scale-150 cursor-zoom-out" : ""}`}
                draggable={false}
              />

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1">
                <LuImage size={11} />
                {activeIdx + 1} / {allImages.length}
              </div>

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
                  >
                    <LuChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all"
                  >
                    <LuChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto flex-shrink-0 scrollbar-none border-t border-gray-100">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      i === activeIdx
                        ? "border-blue-500 scale-105 shadow-md shadow-blue-500/20"
                        : "border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgError[i] ? FALLBACK : src}
                      alt=""
                      onError={() => setImgError((p) => ({ ...p, [i]: true }))}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-[7px] font-black text-white text-center pb-0.5 uppercase tracking-wider">Cover</p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard hint */}
            {allImages.length > 1 && (
              <p className="text-center text-[10px] text-gray-300 pb-2">
                ← → arrow keys to navigate
              </p>
            )}
          </div>

          {/* ── Right: Product Details ── */}
          <div className="md:w-[45%] flex flex-col overflow-y-auto p-8">
            {/* Type + Stock badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${typeColor.bg} ${typeColor.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${typeColor.dot}`} />
                {product.type || "Digital"}
              </span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <LuZap size={11} /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
              {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.comparePrice}</span>
                  <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-6">
              + 18% GST · Total: <span className="font-bold text-gray-600">₹{(parseFloat(product.price) * 1.18).toFixed(2)}</span>
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-6" />

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <LuTag size={13} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Type</span>
                </div>
                <p className="text-sm font-bold text-gray-800">{product.type || "Digital"}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <LuBoxes size={13} className="text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Stock</span>
                </div>
                <p className="text-sm font-bold text-gray-800">{product.stock || 0} units</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-4 border-t border-gray-50 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => onAddToCart && onAddToCart(product)}
                  disabled={!product.stock || product.stock <= 0}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-[#0f2c59] text-[#0f2c59] font-black text-sm hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <LuShoppingCart size={18} />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => onBuyNow && onBuyNow(product)}
                  disabled={!product.stock || product.stock <= 0 || !isLoggedIn}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-black text-sm hover:shadow-xl hover:shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <LuZap size={18} />
                  {!isLoggedIn ? "Login to Buy" : product.stock > 0 ? "Buy Now" : "Out of Stock"}
                </button>
              </div>
              <p className="text-center text-xs text-gray-400">
                {isLoggedIn
                  ? "🔒 Secure checkout · Instant delivery"
                  : "You'll be redirected to login, then back here."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
