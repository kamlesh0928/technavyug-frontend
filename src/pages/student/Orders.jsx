import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";

export default function StudentOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-orders"],
    queryFn: () => studentService.getMyOrders(),
  });
  const orders = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Your purchase history</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Order</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Amount</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Status</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No orders yet</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-mono text-gray-600">{o.id?.slice(0, 8)}...</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{o.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${o.status === "Completed" ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
