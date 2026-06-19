import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.services";
import {
  LuSearch,
  LuShoppingBag,
  LuClock,
  LuEye,
  LuBookOpen,
  LuMapPin,
  LuX,
  LuCircleCheck,
} from "react-icons/lu";
import { toast } from "react-toastify";

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const queryClient = useQueryClient();

  // Queries
  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-orders", search],
    queryFn: () => adminService.getAllOrders({ search: search || undefined }),
    enabled: activeTab === "products",
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery(
    {
      queryKey: ["admin-transactions", search],
      queryFn: () =>
        adminService.getAllTransactions({ search: search || undefined }),
      enabled: activeTab === "courses",
    },
  );

  const orders = ordersData?.data || [];
  const transactions = transactionsData?.data || [];

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (
      window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    ) {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
      case "Delivered":
      case "Success":
        return "text-green-600 bg-green-50 border-green-100";
      case "Pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "Processing":
      case "Shipped":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "Cancelled":
      case "Refunded":
      case "Failed":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
        <p className="text-gray-500 mt-1">
          Monitor and process all platform transactions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-[#0f2c59] text-[#0f2c59]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Product Orders
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${
            activeTab === "courses"
              ? "border-[#0f2c59] text-[#0f2c59]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Course Purchases
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Product Orders Table */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Order Details
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Customer
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoadingOrders ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      Retrieving order records...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No product orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                            <LuShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {o.orderNumber ||
                                `#${o.id?.slice(0, 8).toUpperCase()}`}
                            </p>
                            {o.invoiceNumber && (
                              <p className="text-[10px] text-gray-400 font-mono">
                                {o.invoiceNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                            {o.User?.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {o.User?.name || "Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">
                          ₹{parseFloat(o.totalAmount || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                          className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${getStatusStyle(o.status)}`}
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <LuClock size={12} />
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <LuEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Transactions Table */}
      {activeTab === "courses" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Transaction ID
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Course / Student
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Date
                  </th>
                  <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoadingTransactions ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      Retrieving course transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 italic"
                    >
                      No course purchases found
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                            <LuBookOpen size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {t.merchantOrderId}
                            </p>
                            {t.providerReferenceId && (
                              <p className="text-[10px] text-gray-400 font-mono">
                                {t.providerReferenceId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-[#0f2c59] line-clamp-1">
                            {t.Course?.title || "Unknown Course"}
                          </span>
                          <span className="text-xs text-gray-500">
                            by {t.User?.name || "Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">
                          ₹{parseFloat(t.amount || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full border ${getStatusStyle(t.status)}`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <LuClock size={12} />
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedTransaction(t)}
                          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <LuEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LuCircleCheck size={14} /> Customer Info
                  </h3>
                  <p className="font-bold text-gray-900">
                    {selectedOrder.User?.name || "Guest"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder.User?.email || "No email"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    Status: {selectedOrder.status}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LuMapPin size={14} /> Shipping Address
                  </h3>
                  {(() => {
                    const address = selectedOrder.shippingAddress;
                    if (!address)
                      return (
                        <p className="text-sm text-gray-500 italic">
                          No address provided
                        </p>
                      );
                    let parsed = address;
                    if (typeof address === "string") {
                      try {
                        parsed = JSON.parse(address);
                      } catch {
                        return (
                          <p className="text-sm text-gray-500 italic">
                            Invalid address format
                          </p>
                        );
                      }
                    }
                    return (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-bold text-gray-900">{parsed.name}</p>
                        <p>{parsed.addressLine1}</p>
                        {parsed.addressLine2 && <p>{parsed.addressLine2}</p>}
                        <p>
                          {parsed.city}, {parsed.state} {parsed.pincode}
                        </p>
                        {parsed.phone && (
                          <p className="mt-2 text-xs">Phone: {parsed.phone}</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">
                  Order Items
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <LuShoppingBag className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {item.Product?.name || "Unknown Product"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-sm text-gray-900">
                          ₹{parseFloat(item.totalPrice || 0).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Inc. GST: ₹
                          {parseFloat(item.gstAmount || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      ₹{parseFloat(selectedOrder.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>
                      ₹{parseFloat(selectedOrder.gstAmount || 0).toFixed(2)}
                    </span>
                  </div>
                  {parseFloat(selectedOrder.discountAmount || 0) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -₹
                        {parseFloat(selectedOrder.discountAmount || 0).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200 mt-2">
                    <span>Total Paid</span>
                    <span>
                      ₹{parseFloat(selectedOrder.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900">
                Transaction Details
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <LuCircleCheck className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">
                    Payment {selectedTransaction.status}
                  </p>
                  <p className="text-2xl font-black text-blue-700">
                    ₹{parseFloat(selectedTransaction.amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Course</span>
                  <span className="font-bold text-sm text-gray-900 text-right max-w-[200px] truncate">
                    {selectedTransaction.Course?.title || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Student</span>
                  <span className="font-bold text-sm text-gray-900">
                    {selectedTransaction.User?.name || "Guest"}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">
                    Merchant Order ID
                  </span>
                  <span className="font-mono text-xs text-gray-900">
                    {selectedTransaction.merchantOrderId}
                  </span>
                </div>
                {selectedTransaction.providerReferenceId && (
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">
                      Bank Reference
                    </span>
                    <span className="font-mono text-xs text-gray-900">
                      {selectedTransaction.providerReferenceId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Date</span>
                  <span className="font-bold text-sm text-gray-900">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
