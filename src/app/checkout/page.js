/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, SignIn } from '@clerk/nextjs';
import useCartStore from '../../../components/store/cartStore';
import CheckoutProgress from '../../../components/checkout/CheckoutProgress';
import CartReview from '../../../components/checkout/CartReview';
import ShippingForm from '../../../components/checkout/ShippingForm';
import PaymentForm from '../../../components/checkout/PaymentForm';
import OrderSummary from '../../../components/checkout/OrderSummary';
import EmptyCart from '../../../components/checkout/EmptyCart';
import { useCheckoutSteps } from '../../../components/checkout/hooks/useChekoutSteps';
import { useOrderCalculations } from '../../../components/checkout/hooks/useOrderCalculations';
import { AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { user, isLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const router = useRouter();

  const {
    step, setStep,
    shippingInfo, setShippingInfo,
    paymentInfo, setPaymentInfo,
    promoCode, setPromoCode,
    discount, setDiscount
  } = useCheckoutSteps();

  const { subtotal, discountAmount, shipping, tax, total } = useOrderCalculations(cart, discount);

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Auto-fill user info if available
  useEffect(() => {
    if (isLoaded && user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || ''
      }));
    }
  }, [user, isLoaded, setShippingInfo]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) router.push('/shop');
  }, [cart.length, router]);

  // Fixed: Use cartKey instead of id
  const handleQuantityChange = (cartKey, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartKey);
    } else {
      updateQuantity(cartKey, newQuantity);
    }
  };

  // Fixed: Use cartKey for remove
  const handleRemoveItem = (cartKey) => {
    removeFromCart(cartKey);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create order using the cart store method
      const result = await useCartStore.getState().createOrder(
        shippingInfo,
        shippingInfo, // Use same for billing unless you have separate billing form
        paymentInfo
      );

      if (result.success) {
        clearCart();
        router.push(`/order-success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary transition-all duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // If cart empty
  if (cart.length === 0) {
    return <EmptyCart onContinueShopping={() => router.push('/shop')} />;
  }

  // Gate: show Sign In when not authenticated
  if (authLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-primary">Sign in to continue to checkout</h2>
          <SignIn routing="hash" redirectUrl="/checkout" />
        </div>
      </div>
    );
  }

  // Authenticated checkout UI
  return (
    <div className="min-h-screen bg-primary transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutProgress currentStep={step} />
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
          <div className="xl:col-span-3">
            <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 transition-all duration-300">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <CartReview
                    cart={cart}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    onNext={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <ShippingForm
                    shippingInfo={shippingInfo}
                    setShippingInfo={setShippingInfo}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}
                {step === 3 && (
                  <PaymentForm
                    paymentInfo={paymentInfo}
                    setPaymentInfo={setPaymentInfo}
                    total={total}
                    isLoading={isLoading}
                    onBack={() => setStep(2)}
                    onSubmit={handlePayment}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="xl:col-span-1">
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              discount={discount}
              discountAmount={discountAmount}
              shipping={shipping}
              tax={tax}
              total={total}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              setDiscount={setDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
