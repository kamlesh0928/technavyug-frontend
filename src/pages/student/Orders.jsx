import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import { LuPackage, LuReceipt } from "react-icons/lu";

const STATUS_STYLES = {
  Pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Processing: "text-blue-600 bg-blue-50 border-blue-200",
  Shipped: "text-purple-600 bg-purple-50 border-purple-200",
  Delivered: "text-green-600 bg-green-50 border-green-200",
  Cancelled: "text-red-600 bg-red-50 border-red-200",
  Refunded: "text-gray-600 bg-gray-50 border-gray-200",
};

export default function StudentOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-orders"],
    queryFn: () => studentService.getMyOrders(),
  });
  const orders = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Your purchase history and invoices</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-20 flex flex-col items-center justify-center text-gray-400">
          <LuPackage size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-bold text-gray-600">No orders yet</p>
          <p className="text-sm">Your purchases will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items || [];
            const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
            const subtotal = parseFloat(order.subtotal || 0);
            const gstAmount = parseFloat(order.gstAmount || 0);
            const discount = parseFloat(order.discountAmount || 0);
            const total = parseFloat(order.totalAmount || 0);

            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Order</p>
                      <p className="text-sm font-bold text-gray-900">{order.orderNumber || order.id?.slice(0, 8)}</p>
                    </div>
                    {order.invoiceNumber && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><LuReceipt size={10} /> Invoice</p>
                        <p className="text-sm font-mono text-gray-600">{order.invoiceNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 flex-1 mr-3">
                          <span className="font-medium">{item.Product?.name || "Product"}</span>
                          <span className="text-gray-400 ml-1">×{item.quantity}</span>
                        </span>
                        <span className="font-bold text-gray-900 whitespace-nowrap">₹{parseFloat(item.totalPrice || item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-gray-100 pt-3 space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {gstAmount > 0 && (
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-green-600">
                        <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-50">
                      <span>Total Paid</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
