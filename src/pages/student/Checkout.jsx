import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import { studentService } from "@/services/student.services";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/store/Slices/cartSlice";
import { toast } from "react-toastify";
import {
  LuMapPin,
  LuPlus,
  LuTag,
  LuCheck,
  LuLoader,
  LuShield,
  LuChevronRight,
  LuTrash2,
  LuPackage,
  LuReceipt,
} from "react-icons/lu";

const GST_RATE = 18;

function AddressForm({ onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
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
    onSave(form);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <input
        name="addressLine1"
        placeholder="Address Line 1"
        value={form.addressLine1}
        onChange={handleChange}
        required
        className={inputClass}
      />
      <input
        name="addressLine2"
        placeholder="Address Line 2 (Optional)"
        value={form.addressLine2}
        onChange={handleChange}
        className={inputClass}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-[#0f2c59] text-white text-sm font-bold hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {saving ? (
            <LuLoader size={16} className="animate-spin" />
          ) : (
            <LuCheck size={16} />
          )}
          Save Address
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const reduxCartItems = useSelector(selectCartItems);
  const reduxCartTotal = useSelector(selectCartTotal);

  const buyNowItem = location.state?.buyNowItem;

  const cartItems = buyNowItem ? [buyNowItem] : reduxCartItems;
  const cartTotal = buyNowItem
    ? parseFloat(buyNowItem.price) * buyNowItem.quantity
    : reduxCartTotal;

  // GST Calculations
  const gstAmount = Math.round(((cartTotal * GST_RATE) / 100) * 100) / 100;
  const subtotalWithGST = cartTotal + gstAmount;

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [paying, setPaying] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!buyNowItem && reduxCartItems.length === 0) {
      navigate("/products");
    }
  }, [buyNowItem, reduxCartItems.length, navigate]);

  // Fetch addresses
  const {
    data: addressData,
    isLoading: addressLoading,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: () => studentService.getAddresses(),
  });
  const addresses = useMemo(() => addressData?.data || [], [addressData]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault);
      setSelectedAddressId(def ? def.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Show form if no addresses
  useEffect(() => {
    if (!addressLoading && addresses.length === 0) {
      setShowAddressForm(true);
    }
  }, [addressLoading, addresses.length]);

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: (data) => studentService.createAddress(data),
    onSuccess: (res) => {
      toast.success(res.message || "Address saved");
      setShowAddressForm(false);
      setSelectedAddressId(res.data.id);
      refetchAddresses();
    },
    onError: (err) => toast.error(err?.userMessage || "Failed to save address"),
  });

  // Validate coupon mutation
  const couponMutation = useMutation({
    mutationFn: (data) => studentService.validateCoupon(data),
    onSuccess: (res) => {
      setCouponResult(res.data);
      toast.success("Coupon applied");
    },
    onError: (err) => {
      setCouponResult(null);
      toast.error(err?.data?.message || err?.userMessage || "Invalid coupon");
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    couponMutation.mutate({
      code: couponCode,
      subtotal: subtotalWithGST,
      applicableTo: "product",
    });
  };

  // Reset coupon if cart changes to prevent invalid discount amounts
  useEffect(() => {
    if (couponResult) {
      setCouponResult(null);
      setCouponCode("");
      toast.info("Cart updated. Please reapply your coupon.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotal]);

  const removeCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
  };

  const discountAmount = couponResult?.discountAmount || 0;
  const finalTotal = Math.max(0, subtotalWithGST - discountAmount);

  const handlePay = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add a shipping address");
      return;
    }
    setPaying(true);
    try {
      // Fetch latest cart from localStorage to avoid any state synchronization or cross-tab issues, only if not Buy Now
      let finalCartItems = cartItems;
      if (!buyNowItem) {
        const latestCartJson = localStorage.getItem("cart");
        finalCartItems = latestCartJson
          ? JSON.parse(latestCartJson)
          : reduxCartItems;
      }

      const payload = {
        items: finalCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        addressId: selectedAddressId,
        couponCode: couponResult ? couponCode : undefined,
      };
      const res = await studentService.initiateOrderPayment(payload);
      if (!buyNowItem) {
        dispatch(clearCart());
      }
      // Redirect to PhonePe checkout
      if (res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error("Could not get payment URL. Please try again.");
        setPaying(false);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || err?.userMessage || "Payment initiation failed",
      );
      setPaying(false);
    }
  };

  if (cartItems.length === 0) return null;

  // Per-item GST calculation
  const getItemGST = (price, quantity) => {
    const taxable = parseFloat(price) * quantity;
    return Math.round(((taxable * GST_RATE) / 100) * 100) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Address + Coupon */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <LuMapPin size={18} className="text-[#0f2c59]" /> Shipping
                  Address
                </h2>
                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-sm font-bold text-[#0f2c59] hover:underline flex items-center gap-1"
                  >
                    <LuPlus size={14} /> Add New
                  </button>
                )}
              </div>

              {addressLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LuLoader size={24} className="animate-spin text-gray-400" />
                </div>
              ) : showAddressForm ? (
                <AddressForm
                  onSave={(data) => createAddressMutation.mutate(data)}
                  onCancel={
                    addresses.length > 0
                      ? () => setShowAddressForm(false)
                      : null
                  }
                  saving={createAddressMutation.isPending}
                />
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-[#0f2c59] bg-blue-50/30" : "border-gray-100 hover:border-gray-200"}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-[#0f2c59]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">
                          {addr.name}{" "}
                          <span className="font-normal text-gray-500">
                            | {addr.phone}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.addressLine1}
                          {addr.addressLine2
                            ? `, ${addr.addressLine2}`
                            : ""}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        {addr.isDefault && (
                          <span className="inline-block mt-1 text-xs font-bold text-[#0f2c59] bg-blue-50 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <LuTag size={18} className="text-[#0f2c59]" /> Apply Coupon
              </h2>
              {couponResult ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-green-700">
                      {couponResult.code} applied
                    </p>
                    <p className="text-xs text-green-600">
                      You save ₹{couponResult.discountAmount}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 outline-none transition-all uppercase tracking-wider"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponMutation.isPending || !couponCode.trim()}
                    className="px-6 py-3 rounded-xl bg-[#0f2c59] text-white text-sm font-bold hover:bg-blue-800 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {couponMutation.isPending ? (
                      <LuLoader size={14} className="animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <LuPackage size={18} className="text-[#0f2c59]" /> Order Summary
              </h2>

              {/* Item List */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => {
                  const itemPrice = parseFloat(item.price) * item.quantity;
                  const itemGst = getItemGST(item.price, item.quantity);
                  return (
                    <div key={item.id} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex-1 mr-2 line-clamp-1 font-medium">
                          {item.name} ×{item.quantity}
                        </span>
                        <span className="font-bold text-gray-900 whitespace-nowrap">
                          ₹{itemPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[11px] text-gray-400 ml-1">
                          GST @{GST_RATE}%
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ₹{itemGst.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <LuReceipt size={12} className="text-blue-500" />
                    GST (18%)
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{gstAmount.toFixed(2)}
                  </span>
                </div>
                {/* GST Split */}
                <div className="flex justify-between text-xs pl-4">
                  <span className="text-gray-400">CGST (9%)</span>
                  <span className="text-gray-400">
                    ₹{(gstAmount / 2).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs pl-4">
                  <span className="text-gray-400">SGST (9%)</span>
                  <span className="text-gray-400">
                    ₹{(gstAmount / 2).toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-bold text-green-600">
                      -₹{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-gray-900 text-xl">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">
                  Inclusive of all taxes
                </p>
              </div>
              <button
                onClick={handlePay}
                disabled={paying || !selectedAddressId}
                className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <LuLoader size={18} className="animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{finalTotal.toFixed(2)} with PhonePe{" "}
                    <LuChevronRight size={16} />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <LuShield size={12} /> Secure payment via PhonePe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
