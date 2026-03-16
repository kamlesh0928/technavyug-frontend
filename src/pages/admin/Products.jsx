import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { LuPlus } from "react-icons/lu";

export default function AdminProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts(),
  });
  const products = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage e-commerce products</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f2c59] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1d4e89] transition-all">
          <LuPlus size={16} /> Add Product
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse" />)
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">No products yet</div>
        ) : products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-[#0f2c59]">₹{p.price}</span>
              <span className="text-xs text-gray-400">Stock: {p.stock}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
