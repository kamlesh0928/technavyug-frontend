export default function InstructorEarnings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your revenue and payouts</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p className="text-5xl font-black text-[#0f2c59] mb-2">₹0.00</p>
        <p className="text-gray-500 text-sm">Total Earnings</p>
        <p className="text-gray-400 text-xs mt-6">Earnings tracking will be available once payment integration is configured.</p>
      </div>
    </div>
  );
}
