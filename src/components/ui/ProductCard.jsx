import { useState, useCallback } from "react";
import { LuChevronLeft, LuChevronRight, LuShoppingCart, LuImage, LuPackage } from "react-icons/lu";

import { parseImages } from "@/utils/helpers";

const FALLBACK = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800";

const TYPE_STYLES = {
  Digital: "bg-blue-100 text-blue-700",
  Physical: "bg-emerald-100 text-emerald-700",
  Service: "bg-purple-100 text-purple-700",
};

export default function ProductCard({ product, onDetailClick }) {
  const images = parseImages(product?.images);
  const hasImages = images.length > 0;
  const allImages = hasImages ? images : [FALLBACK];

  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState({});

  const prev = useCallback(
    (e) => {
      e.stopPropagation();
      setActiveIdx((i) => (i - 1 + allImages.length) % allImages.length);
    },
    [allImages.length]
  );

  const next = useCallback(
    (e) => {
      e.stopPropagation();
      setActiveIdx((i) => (i + 1) % allImages.length);
    },
    [allImages.length]
  );

  const typeStyle = TYPE_STYLES[product?.type] || "bg-gray-100 text-gray-600";

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => onDetailClick && onDetailClick(product)}
    >
      {/* ── Image Slider ── */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden flex-shrink-0">
        {/* Main image */}
        <img
          src={imgError[activeIdx] ? FALLBACK : allImages[activeIdx]}
          alt={product?.name}
          onError={() => setImgError((p) => ({ ...p, [activeIdx]: true }))}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 transition-transform"
          draggable={false}
        />

        {/* Left/Right arrows — visible only when multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <LuChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <LuChevronRight size={16} />
            </button>
          </>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${typeStyle}`}>
            {product?.type || "Digital"}
          </span>
          {allImages.length > 1 && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur">
              <LuImage size={9} /> {allImages.length}
            </span>
          )}
        </div>

        {/* Thumbnail dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {allImages.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-200 ${
                  i === activeIdx
                    ? "w-4 h-1.5 bg-white shadow"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail Strip (Flipkart style) — only if 2+ images ── */}
      {allImages.length > 1 && (
        <div className="flex gap-1.5 px-3 pt-2.5 pb-0">
          {allImages.slice(0, 5).map((src, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === activeIdx
                  ? "border-blue-500 scale-105 shadow-md"
                  : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={imgError[i] ? FALLBACK : src}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImgError((p) => ({ ...p, [i]: true }))}
                draggable={false}
              />
            </button>
          ))}
          {allImages.length > 5 && (
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-[9px] font-black text-gray-400">
              +{allImages.length - 5}
            </div>
          )}
        </div>
      )}

      {/* ── Card info ── */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors text-sm">
          {product?.name}
        </h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product?.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div>
            <span className="text-base font-black text-gray-900">₹{product?.price}</span>
            {product?.stock > 0 ? (
              <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="ml-2 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-[#0f2c59] hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:shadow-md active:scale-95"
          >
            <LuShoppingCart size={13} /> Buy
          </button>
        </div>
      </div>
    </div>
  );
}
