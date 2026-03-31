import {
  LuDollarSign,
  LuTrendingUp,
  LuClock,
  LuCreditCard,
  LuInfo,
} from "react-icons/lu";

export default function InstructorEarnings() {
  const stats = [
    {
      label: "Total Balance",
      value: "₹0.00",
      icon: LuDollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Last Payout",
      value: "₹0.00",
      icon: LuCreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Revenue",
      value: "₹0.00",
      icon: LuClock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="text-gray-500 mt-1">
          Track your revenue, commissions, and upcoming payouts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-lg"
          >
            <div
              className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center shadow-sm`}
            >
              <s.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-3xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center py-20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative z-10">
            <LuTrendingUp size={40} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 relative z-10">
            No Earnings Data
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mb-8 relative z-10">
            You haven't generated any revenue yet. Share your courses with your
            audience to start earning.
          </p>
          <button className="relative z-10 bg-[#0f2c59] text-white px-8 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-blue-900/20 transition-all active:scale-95">
            Promotion Tips
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <LuCreditCard className="text-blue-500" size={24} />
            Payout Method
          </h3>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
            <LuInfo className="text-amber-500 flex-shrink-0" size={20} />
            <div>
              <p className="text-amber-800 font-bold text-sm">
                Action Required
              </p>
              <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                Please set up a payout method to receive your earnings. We
                currently support Direct Bank Transfer and UPI.
              </p>
              <button className="mt-4 text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors">
                Setup Now &rarr;
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Payout Schedule
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Processing Fee</span>
                <span className="font-bold text-gray-900">0%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payout Cycle</span>
                <span className="font-bold text-gray-900 underline underline-offset-4 decoration-dotted">
                  15 Days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
