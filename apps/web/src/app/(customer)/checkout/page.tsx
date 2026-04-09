"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/stores/cart-store";
import { useOrderStore, type ShippingAddress } from "@/lib/stores/order-store";
import { formatPrice } from "@/lib/mock-data";

type Step = "shipping" | "payment" | "confirmation";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit Card", icon: "💳" },
  { id: "kakao", label: "Kakao Pay", icon: "🟡" },
  { id: "naver", label: "Naver Pay", icon: "🟢" },
  { id: "toss", label: "Toss Pay", icon: "🔵" },
] as const;

const EMPTY_ADDRESS: ShippingAddress = {
  firstName: "",
  lastName: "",
  line1: "",
  city: "",
  postalCode: "",
  country: "KR",
  phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("shipping");
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderNumber, setOrderNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = subtotal();
  const shippingFee = total >= 500 ? 0 : 25;

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 text-center">
        <h1 className="font-serif text-4xl mb-6">Checkout</h1>
        <div className="h-40" />
      </div>
    );
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 text-center">
        <h1 className="font-serif text-4xl mb-6">Checkout</h1>
        <p className="text-secondary mb-10">Your bag is empty.</p>
        <Link
          href="/products"
          className="inline-block border border-primary px-10 py-4 text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-serif text-4xl mb-4">Thank You</h1>
        <p className="text-secondary mb-2">
          Your order <span className="text-primary font-medium">{orderNumber}</span> has been placed.
        </p>
        <p className="text-sm text-secondary leading-relaxed max-w-md mx-auto mb-10">
          A confirmation email has been sent. Our team will prepare your items
          with the utmost care in luxury packaging.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/account/orders"
            className="border border-primary px-8 py-3 text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all"
          >
            View Orders
          </Link>
          <Link
            href="/products"
            className="border border-muted px-8 py-3 text-sm tracking-widest uppercase text-secondary hover:border-primary hover:text-primary transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  function validateShipping(): boolean {
    const newErrors: Record<string, string> = {};
    if (!address.firstName.trim()) newErrors.firstName = "Required";
    if (!address.lastName.trim()) newErrors.lastName = "Required";
    if (!address.line1.trim()) newErrors.line1 = "Required";
    if (!address.city.trim()) newErrors.city = "Required";
    if (!address.postalCode.trim()) newErrors.postalCode = "Required";
    if (!address.phone.trim()) newErrors.phone = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleContinueToPayment() {
    if (validateShipping()) {
      setStep("payment");
    }
  }

  async function handlePlaceOrder() {
    setProcessing(true);

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const order = createOrder({
      items: [...items],
      subtotal: total,
      paymentMethod,
      shippingAddress: address,
    });

    setOrderNumber(order.orderNumber);
    clearCart();
    setProcessing(false);
    setStep("confirmation");
  }

  function updateAddress(field: keyof ShippingAddress, value: string) {
    setAddress({ ...address, [field]: value });
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      setErrors(rest);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">
      {/* Steps */}
      <div className="flex items-center justify-center gap-8 mb-16">
        {(["shipping", "payment"] as const).map((s, i) => (
          <button
            key={s}
            onClick={() => s === "shipping" && setStep(s)}
            className={`text-xs tracking-widest uppercase pb-2 border-b-2 transition-colors ${
              step === s ? "border-primary text-primary" : "border-transparent text-secondary"
            }`}
          >
            {i + 1}. {s === "shipping" ? "Shipping" : "Payment"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <div>
              <h2 className="font-serif text-2xl mb-8">Shipping Address</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {(["firstName", "lastName"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs tracking-widest uppercase text-secondary mb-2">
                        {field === "firstName" ? "First Name" : "Last Name"}
                      </label>
                      <input
                        type="text"
                        value={address[field]}
                        onChange={(e) => updateAddress(field, e.target.value)}
                        className={`w-full border px-4 py-3 text-sm bg-transparent focus:outline-none transition-colors ${
                          errors[field] ? "border-red-400 focus:border-red-500" : "border-muted focus:border-primary"
                        }`}
                      />
                      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Address</label>
                  <input
                    type="text"
                    value={address.line1}
                    onChange={(e) => updateAddress("line1", e.target.value)}
                    className={`w-full border px-4 py-3 text-sm bg-transparent focus:outline-none transition-colors ${
                      errors.line1 ? "border-red-400" : "border-muted focus:border-primary"
                    }`}
                  />
                  {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(["city", "postalCode", "phone"] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs tracking-widest uppercase text-secondary mb-2">
                        {field === "postalCode" ? "Postal Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={address[field]}
                        onChange={(e) => updateAddress(field, e.target.value)}
                        className={`w-full border px-4 py-3 text-sm bg-transparent focus:outline-none transition-colors ${
                          errors[field] ? "border-red-400" : "border-muted focus:border-primary"
                        }`}
                      />
                      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                    className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none"
                  >
                    <option value="KR">South Korea</option>
                    <option value="US">United States</option>
                    <option value="JP">Japan</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleContinueToPayment}
                className="mt-10 w-full bg-primary text-white py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h2 className="font-serif text-2xl mb-8">Payment</h2>

              {/* Payment Method Selection */}
              <div className="space-y-3 mb-8">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 border p-4 cursor-pointer transition-colors ${
                      paymentMethod === method.id ? "border-primary bg-surface" : "border-muted hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-primary"
                    />
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Card fields (shown for credit card) */}
              {paymentMethod === "card" && (
                <div className="border border-muted p-6 space-y-4 mb-8">
                  <p className="text-xs text-secondary mb-2">
                    Test mode — no real charges will be made
                  </p>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-secondary mb-2">Expiry</label>
                      <input type="text" placeholder="12 / 28" className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-secondary mb-2">CVC</label>
                      <input type="text" placeholder="123" className="w-full border border-muted px-4 py-3 text-sm bg-transparent focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Non-card: redirect notice */}
              {paymentMethod !== "card" && (
                <div className="border border-muted p-6 mb-8 text-center">
                  <p className="text-sm text-secondary">
                    You will be redirected to {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label} to complete payment.
                  </p>
                </div>
              )}

              {/* Shipping summary */}
              <div className="bg-surface p-4 mb-8 text-sm">
                <p className="text-xs tracking-widest uppercase text-secondary mb-2">Ship to</p>
                <p>{address.firstName} {address.lastName}</p>
                <p className="text-secondary">{address.line1}, {address.city} {address.postalCode}</p>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-xs text-primary underline underline-offset-4 mt-2"
                >
                  Edit
                </button>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="w-full bg-primary text-white py-4 text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {processing ? "Processing..." : `Place Order · ${formatPrice(total + shippingFee)}`}
              </button>
              <p className="mt-4 text-xs text-secondary text-center">
                Your payment is secured with 256-bit encryption.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="bg-surface p-8">
            <h3 className="text-xs tracking-widest uppercase mb-6">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <div className="min-w-0 pr-4">
                    <p className="text-xs text-secondary">{item.brand}</p>
                    <p className="truncate">{item.name}</p>
                    <p className="text-xs text-secondary">Qty: {item.quantity}</p>
                  </div>
                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-muted mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span>{shippingFee === 0 ? "Complimentary" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-muted">
                <span>Total</span>
                <span>{formatPrice(total + shippingFee)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
