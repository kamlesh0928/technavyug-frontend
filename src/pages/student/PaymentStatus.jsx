import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { studentService } from "@/services/student.services";
import {
  LuLoader,
  LuCircleCheck,
  LuCircleX,
  LuArrowRight,
  LuRefreshCw,
} from "react-icons/lu";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const merchantOrderId = searchParams.get("merchantOrderId");
  const type = searchParams.get("type") || "product";

  const [status, setStatus] = useState(merchantOrderId ? "loading" : "error");
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(
    merchantOrderId ? null : "No transaction reference found.",
  );
  const pollCount = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!merchantOrderId) return;

    const checkStatus = async () => {
      try {
        const fetcher =
          type === "course"
            ? studentService.getCoursePurchaseStatus
            : studentService.getOrderPaymentStatus;
        const res = await fetcher(merchantOrderId);
        const data = res.data;

        if (data.status === "Success") {
          setStatus("success");
          setTransaction(data.transaction);
          return true;
        } else if (data.status === "Failed") {
          setStatus("failed");
          setTransaction(data.transaction);
          return true;
        }
        return false;
      } catch {
        if (pollCount.current >= 10) {
          setStatus("error");
          setError("Unable to verify payment. Please check your orders page.");
          return true;
        }
        return false;
      }
    };

    const poll = async () => {
      pollCount.current += 1;
      const done = await checkStatus();
      if (!done && pollCount.current < 15) {
        timerRef.current = setTimeout(poll, 3000);
      } else if (!done) {
        setStatus("error");
        setError(
          "Payment verification timed out. Please check your orders page or contact support.",
        );
      }
    };

    poll();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [merchantOrderId, type]);

  const handleRetry = () => {
    setStatus("loading");
    pollCount.current = 0;
    const checkAgain = async () => {
      const fetcher =
        type === "course"
          ? studentService.getCoursePurchaseStatus
          : studentService.getOrderPaymentStatus;
      try {
        const res = await fetcher(merchantOrderId);
        const data = res.data;
        if (data.status === "Success") {
          setStatus("success");
          setTransaction(data.transaction);
        } else if (data.status === "Failed") {
          setStatus("failed");
          setTransaction(data.transaction);
        } else {
          setStatus("error");
          setError("Payment is still pending. Please wait or contact support.");
        }
      } catch {
        setStatus("error");
        setError("Could not verify payment status.");
      }
    };
    checkAgain();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {status === "loading" && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <LuLoader size={36} className="animate-spin text-[#0f2c59]" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-sm text-gray-500">
              Please wait while we confirm your payment with PhonePe. Do not
              close this page.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <LuCircleCheck size={40} className="text-green-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Payment Successful
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {type === "course"
                ? "You now have access to the course. Start learning right away!"
                : "Your order has been confirmed. We will process it shortly."}
            </p>
            {transaction && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount Paid</span>
                  <span className="font-bold text-gray-900">
                    ₹{parseFloat(transaction.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-600">
                    {transaction.merchantOrderId}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 pt-1">
                  Amount is inclusive of 18% GST
                </p>
              </div>
            )}
            {type === "product" && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-left">
                <p className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                  <LuCircleCheck size={14} />
                  Tax invoice and order confirmation have been sent to your
                  email.
                </p>
              </div>
            )}
            <button
              onClick={() =>
                navigate(
                  type === "course" ? "/student/courses" : "/student/orders",
                )
              }
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all text-sm"
            >
              {type === "course" ? "Go to My Courses" : "View My Orders"}{" "}
              <LuArrowRight size={16} />
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <LuCircleX size={40} className="text-red-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your payment could not be completed. No amount has been charged.
              You can try again.
            </p>
            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate(type === "course" ? `/courses` : "/products")
                }
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0f2c59] to-blue-700 text-white font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all text-sm"
              >
                Try Again <LuArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <LuRefreshCw size={36} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">
              Verification Issue
            </h2>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full py-4 rounded-2xl bg-[#0f2c59] text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all text-sm"
              >
                <LuRefreshCw size={16} /> Retry Verification
              </button>
              <button
                onClick={() =>
                  navigate(
                    type === "course" ? "/student/courses" : "/student/orders",
                  )
                }
                className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                {type === "course" ? "My Courses" : "My Orders"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
