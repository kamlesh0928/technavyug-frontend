import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import {
  LuPlus, LuPencil, LuTrash, LuPackage, LuCloudUpload,
  LuX, LuTriangleAlert, LuImage, LuChevronLeft, LuChevronRight,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { parseImages } from "@/components/ui/ProductCard";

const FALLBACK = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800";

// ── Admin product card with image slider ──────────────────────────────────────
function AdminProductCard({ product: p, onEdit, onDelete }) {
  const imgs = parseImages(p.images);
  const allImgs = imgs.length > 0 ? imgs : [FALLBACK];
  const [idx, setIdx] = useState(0);
  const [imgErr, setImgErr] = useState({});
  const safeIdx = Math.min(idx, allImgs.length - 1);

  const prev = (e) => {
    e.stopPropagation();
    setIdx((i) => (i - 1 + allImgs.length) % allImgs.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx((i) => (i + 1) % allImgs.length);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Image Slider */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img
          src={imgErr[safeIdx] ? FALLBACK : allImgs[safeIdx]}
          alt={p.name}
          onError={() => setImgErr((s) => ({ ...s, [safeIdx]: true }))}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {allImgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <LuChevronLeft size={15} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <LuChevronRight size={15} />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
              {allImgs.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${i === safeIdx ? "w-3.5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                />
              ))}
            </div>
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-bold bg-black/40 text-white px-1.5 py-0.5 rounded-full backdrop-blur pointer-events-none">
              <LuImage size={9} /> {allImgs.length}
            </div>
          </>
        )}

        {/* Edit / Delete */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(p); }}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-gray-600 hover:text-cyan-600 shadow-sm transition-all"
          >
            <LuPencil size={15} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(p); }}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm transition-all"
          >
            <LuTrash size={15} />
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      {allImgs.length > 1 && (
        <div className="flex gap-1.5 px-3 pt-2">
          {allImgs.slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-9 h-9 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                i === safeIdx ? "border-blue-500 shadow" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={imgErr[i] ? FALLBACK : src}
                alt=""
                onError={() => setImgErr((s) => ({ ...s, [i]: true }))}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {allImgs.length > 4 && (
            <div className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-[9px] font-black text-gray-400">
              +{allImgs.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {p.type}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">{p.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed h-8">{p.description || "No description provided."}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
            <span className="text-lg font-black text-gray-900">₹{p.price}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <LuImage size={12} />
            {imgs.length} photo{imgs.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminProducts page ───────────────────────────────────────────────────
export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts(),
  });
  const products = data?.data || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "0", type: "Digital", images: [] });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingProduct) {
      const existingImages = parseImages(editingProduct.images);
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "0",
        type: editingProduct.type || "Digital",
        images: existingImages,
      });
      setImagePreviews(existingImages);
      setImageFiles([]);
      setIsAdding(true);
    }
  }, [editingProduct]);

  const resetForm = () => {
    setIsAdding(false);
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", stock: "0", type: "Digital", images: [] });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["public-products"] });
  };

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createProduct({ ...data, price: Number(data.price), stock: Number(data.stock) }),
    onSuccess: () => { toast.success("Product created successfully"); invalidate(); resetForm(); },
    onError: (e) => toast.error(e?.userMessage || "Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => adminService.updateProduct(id, { ...data, price: Number(data.price), stock: Number(data.stock) }),
    onSuccess: () => { toast.success("Product updated successfully"); invalidate(); resetForm(); },
    onError: (e) => toast.error(e?.userMessage || "Failed to update product"),
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    const existingLen = formData.images?.length || 0;
    if (index < existingLen) {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
    } else {
      const newFiles = [...imageFiles];
      newFiles.splice(index - existingLen, 1);
      setImageFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let uploadedImages = [...(formData.images || [])];
      for (const file of imageFiles) {
        const payload = new FormData();
        payload.append("image", file);
        const res = await adminService.uploadProductImage(payload);
        if (res?.data?.url) uploadedImages.push(res.data.url);
      }
      const finalData = { ...formData, images: uploadedImages };
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, ...finalData });
      } else {
        await createMutation.mutateAsync(finalData);
      }
    } catch (err) {
      toast.error(err?.userMessage || err?.response?.data?.message || "Error processing product");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => { toast.success("Product deleted successfully"); invalidate(); setDeletingProduct(null); },
    onError: (e) => toast.error(e?.userMessage || "Failed to delete product"),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Manage e-commerce inventory and digital assets</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="flex items-center gap-2 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all"
        >
          <LuPlus size={18} /> Add New Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
              <div className="bg-gray-100 aspect-[4/3] rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-gray-100 rounded w-1/4" />
                <div className="h-8 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-gray-400">
            <LuPackage size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-bold">No products found</p>
            <p className="text-sm">Start adding items to your store</p>
          </div>
        ) : (
          products.map((p) => (
            <AdminProductCard
              key={p.id}
              product={p}
              onEdit={setEditingProduct}
              onDelete={setDeletingProduct}
            />
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-900 transition-colors">
                <LuX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Price (₹)</label>
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Stock</label>
                  <input required type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                  <option value="Digital">Digital</option>
                  <option value="Physical">Physical</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
              </div>

              {/* Multi-image upload */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">
                  Product Images
                  {imagePreviews.length > 0 && (
                    <span className="ml-2 text-cyan-600 normal-case font-bold">({imagePreviews.length} selected)</span>
                  )}
                </label>
                <label className="mt-1 flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-cyan-400 transition-colors group">
                  <LuCloudUpload size={28} className="text-gray-300 group-hover:text-cyan-500 mb-2 transition-colors" />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-cyan-600 transition-colors">Click to upload images</span>
                  <span className="text-xs text-gray-300 mt-0.5">You can select multiple at once</span>
                  <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 group/img">
                        <img src={preview} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.onerror=null; e.target.src=FALLBACK; }} />
                        {i === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-[8px] font-black text-white text-center pb-0.5 uppercase tracking-wider">Cover</p>
                          </div>
                        )}
                        <button type="button" onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-red-500 backdrop-blur transition-all opacity-0 group-hover/img:opacity-100">
                          <LuX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-xl border text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={isUploading || createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-[#0f2c59] text-white font-bold disabled:opacity-70 transition-all flex justify-center items-center gap-2">
                  {isUploading || createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isUploading ? "Uploading..." : "Saving..."}</span>
                    </>
                  ) : editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !deleteMutation.isPending && setDeletingProduct(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-rose-600" />
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-100 rounded-full flex items-center justify-center shadow-lg">
                    <LuTriangleAlert size={36} className="text-red-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-6 border border-gray-100">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={parseImages(deletingProduct.images)[0] || FALLBACK}
                    alt={deletingProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{deletingProduct.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">₹{deletingProduct.price} · {deletingProduct.type}</p>
                </div>
              </div>
              <h2 className="text-xl font-black text-gray-900 text-center">Delete this product?</h2>
              <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                This will <span className="font-bold text-red-500">permanently remove</span> the product and all its data.
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDeletingProduct(null)} disabled={deleteMutation.isPending}
                  className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all text-sm disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={() => deleteMutation.mutate(deletingProduct.id)} disabled={deleteMutation.isPending}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 active:scale-95 transition-all text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                  {deleteMutation.isPending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                  ) : (
                    <><LuTrash size={16} /> Delete Product</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
