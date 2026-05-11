import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import { toast } from "react-toastify";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuTag,
  LuSearch,
  LuX,
  LuLoader,
} from "react-icons/lu";

function CouponModal({ coupon, onClose, onSave, saving }) {
  const isEdit = !!coupon?.id;
  const [form, setForm] = useState({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    maxDiscount: coupon?.maxDiscount || "",
    minOrderAmount: coupon?.minOrderAmount || "0",
    expiryDate: coupon?.expiryDate || "",
    usageLimit: coupon?.usageLimit || "",
    applicableTo: coupon?.applicableTo || "all",
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      discountValue: parseFloat(form.discountValue),
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
      minOrderAmount: parseFloat(form.minOrderAmount || 0),
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
    };
    onSave(payload);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100"
          >
            <LuX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              placeholder="SAVE20"
              className={`${inputClass} uppercase tracking-wider`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Discount Type
              </label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Discount Value
              </label>
              <input
                name="discountValue"
                type="number"
                step="0.01"
                value={form.discountValue}
                onChange={handleChange}
                required
                placeholder="20"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Max Discount (Rs.)
              </label>
              <input
                name="maxDiscount"
                type="number"
                step="0.01"
                value={form.maxDiscount}
                onChange={handleChange}
                placeholder="Optional"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Min Order Amount
              </label>
              <input
                name="minOrderAmount"
                type="number"
                step="0.01"
                value={form.minOrderAmount}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                name="usageLimit"
                type="number"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="Unlimited"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Applicable To
              </label>
              <select
                name="applicableTo"
                value={form.applicableTo}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="all">All</option>
                <option value="course">Course Only</option>
                <option value="product">Product Only</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="accent-[#0f2c59] w-4 h-4"
                />
                <span className="text-sm font-bold text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#0f2c59] text-white font-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {saving ? <LuLoader size={16} className="animate-spin" /> : null}
              {isEdit ? "Update Coupon" : "Create Coupon"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalCoupon, setModalCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-coupons", { search, page }],
    queryFn: () =>
      adminService.getCoupons({ search: search || undefined, page, limit: 20 }),
  });

  const coupons = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (d) => adminService.createCoupon(d),
    onSuccess: (res) => {
      toast.success(res.message);
      setShowModal(false);
      queryClient.invalidateQueries(["admin-coupons"]);
    },
    onError: (err) =>
      toast.error(
        err?.data?.message || err?.userMessage || "Failed to create coupon",
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: d }) => adminService.updateCoupon(id, d),
    onSuccess: (res) => {
      toast.success(res.message);
      setShowModal(false);
      queryClient.invalidateQueries(["admin-coupons"]);
    },
    onError: (err) =>
      toast.error(
        err?.data?.message || err?.userMessage || "Failed to update coupon",
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteCoupon(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["admin-coupons"]);
    },
    onError: (err) =>
      toast.error(
        err?.data?.message || err?.userMessage || "Failed to delete coupon",
      ),
  });

  const handleSave = (payload) => {
    if (modalCoupon?.id) {
      updateMutation.mutate({ id: modalCoupon.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <LuTag size={22} className="text-[#0f2c59]" /> Coupon Management
        </h1>
        <button
          onClick={() => {
            setModalCoupon(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2c59] text-white text-sm font-bold hover:bg-blue-800 transition-all"
        >
          <LuPlus size={16} /> Create Coupon
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <LuSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={17}
        />
        <input
          type="text"
          placeholder="Search by code..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none shadow-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LuLoader size={28} className="animate-spin text-gray-400" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <LuTag size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-bold text-gray-600">No coupons found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-bold text-gray-500">Code</th>
                  <th className="px-4 py-3 font-bold text-gray-500">
                    Discount
                  </th>
                  <th className="px-4 py-3 font-bold text-gray-500">Expiry</th>
                  <th className="px-4 py-3 font-bold text-gray-500">Usage</th>
                  <th className="px-4 py-3 font-bold text-gray-500">Scope</th>
                  <th className="px-4 py-3 font-bold text-gray-500">Status</th>
                  <th className="px-4 py-3 font-bold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => {
                  const expired =
                    c.expiryDate < new Date().toISOString().split("T")[0];
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-gray-50 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3 font-bold text-gray-900 tracking-wider">
                        {c.code}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}%`
                          : `Rs. ${c.discountValue}`}
                        {c.maxDiscount ? ` (max Rs. ${c.maxDiscount})` : ""}
                      </td>
                      <td
                        className={`px-4 py-3 ${expired ? "text-red-500" : "text-gray-700"}`}
                      >
                        {c.expiryDate}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {c.usedCount}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 capitalize">
                          {c.applicableTo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.isActive && !expired ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {expired
                            ? "Expired"
                            : c.isActive
                              ? "Active"
                              : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setModalCoupon(c);
                              setShowModal(true);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0f2c59] hover:bg-blue-50"
                          >
                            <LuPencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <LuTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <CouponModal
          coupon={modalCoupon}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
