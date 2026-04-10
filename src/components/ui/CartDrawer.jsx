import { useDispatch, useSelector } from "react-redux";
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartOpen,
} from "@/store/Slices/cartSlice";
import { parseImages } from "@/utils/helpers";
import {
  LuX,
  LuTrash2,
  LuPlus,
  LuMinus,
  LuShoppingCart,
  LuArrowRight,
  LuPackage,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const FALLBACK = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const images = parseImages(item?.images);
  const img = images[0] || FALLBACK;

  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
        <img src={img} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
          {item.name}
        </p>
        <p className="text-xs text-gray-400 mb-2">{item.type || "Digital"}</p>

        {/* Quantity row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() =>
                dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
              }
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            >
              <LuMinus size={13} />
            </button>
            <span className="w-7 text-center text-sm font-black text-gray-900">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
              }
              disabled={item.quantity >= (item.stock || 99)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-30"
            >
              <LuPlus size={13} />
            </button>
          </div>

          <span className="text-sm font-black text-gray-900">
            ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => dispatch(removeFromCart(item.id))}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <LuTrash2 size={14} />
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { user } = useSelector((s) => s.auth);

  const itemCount = items.reduce((a, i) => a + i.quantity, 0);

  const handleCheckout = () => {
    dispatch(closeCart());
    if (!user) {
      navigate("/login", { state: { from: "/products" } });
    } else {
      // TODO: navigate to checkout page
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          onClick={() => dispatch(closeCart())}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LuShoppingCart size={20} className="text-[#0f2c59]" />
            <h2 className="text-base font-black text-gray-900">
              My Cart
              {itemCount > 0 && (
                <span className="ml-2 text-xs font-black bg-[#0f2c59] text-white px-2 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
              <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                <LuPackage size={36} className="opacity-40" />
              </div>
              <p className="font-bold text-gray-600 mb-1">Your cart is empty</p>
              <p className="text-sm text-center">
                Browse our products and add something you like!
              </p>
              <button
                onClick={() => {
                  dispatch(closeCart());
                  navigate("/products");
                }}
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2c59] text-white text-sm font-bold hover:bg-blue-800 transition-all"
              >
                <LuShoppingCart size={15} /> Shop Now
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Clear All */}
              <button
                onClick={() => dispatch(clearCart())}
                className="mt-3 text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <LuTrash2 size={12} /> Clear all items
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">
                Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
              </span>
              <span className="text-xl font-black text-gray-900">
                ₹{total.toFixed(0)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-black flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-900/20 active:scale-95 transition-all text-sm"
            >
              {user ? (
                <>Proceed to Checkout <LuArrowRight size={16} /></>
              ) : (
                <>Login to Checkout <LuArrowRight size={16} /></>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              🔒 Secure checkout · Free support
            </p>
          </div>
        )}
      </div>
    </>
  );
}
