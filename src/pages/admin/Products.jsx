import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { LuPlus, LuPencil, LuTrash, LuPackage } from "react-icons/lu";
import { toast } from "react-toastify";
import { useState } from "react";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts(),
  });
  const products = data?.data || [];

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "0", type: "Digital", image: "" });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => adminService.createProduct({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    }),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setIsAdding(false);
      setFormData({ name: "", description: "", price: "", stock: "0", type: "Digital", image: "" });
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to create product"),
  });

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (e) => toast.error(e?.userMessage || "Failed to delete product"),
  });

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Product Catalog
          </h1>
          <p className="text-gray-500 mt-1">
            Manage e-commerce inventory and digital assets
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#0f2c59] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-900/20 active:scale-95 transition-all"
        >
          <LuPlus size={18} /> Add New Product
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse"
            >
              <div className="bg-gray-100 aspect-square rounded-xl" />
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
            <div
              key={p.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img
                  src={
                    p.image ||
                    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-gray-600 hover:text-cyan-600 shadow-sm transition-all">
                    <LuPencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="w-9 h-9 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 shadow-sm transition-all"
                  >
                    <LuTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {p.stock > 0 ? `In Stock (${p.stock})` : "Out of Stock"}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed h-8">
                  {p.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Price
                    </span>
                    <span className="text-lg font-black text-gray-900">
                      ₹{p.price}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Type
                    </span>
                    <p className="text-xs font-bold text-gray-600">
                      {p.type || "Digital"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Product</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Price (₹)</label>
                  <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Stock</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all">
                  <option value="Digital">Digital</option>
                  <option value="Physical">Physical</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-cyan-400 outline-none transition-all" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 rounded-xl border text-gray-600 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 rounded-xl bg-[#0f2c59] text-white font-bold disabled:opacity-70 transition-all">
                  {createMutation.isPending ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
