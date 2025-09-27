/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
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
  const router = useRouter();
  
  const { 
    step, 
    setStep, 
    shippingInfo, 
    setShippingInfo, 
    paymentInfo, 
    setPaymentInfo,
    promoCode,
    setPromoCode,
    discount,
    setDiscount
  } = useCheckoutSteps();

  const { subtotal, discountAmount, shipping, tax, total } = useOrderCalculations(cart, discount);
  
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (cart.length === 0) {
      router.push('/shop');
    }
  }, [cart.length, router]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      router.push('/order-success');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary transition-all duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return <EmptyCart onContinueShopping={() => router.push('/shop')} />;
  }

  return (
    <div className="min-h-screen bg-primary transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Steps */}
        <CheckoutProgress currentStep={step} />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mt-8">
          
          {/* Main Content */}
          <div className="xl:col-span-3">
            <div className="bg-secondary/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 transition-all duration-300">
              <AnimatePresence mode="wait">
                
                {/* Step 1: Cart Review */}
                {step === 1 && (
                  <CartReview
                    cart={cart}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeFromCart}
                    onNext={() => setStep(2)}
                  />
                )}

                {/* Step 2: Shipping Information */}
                {step === 2 && (
                  <ShippingForm
                    shippingInfo={shippingInfo}
                    setShippingInfo={setShippingInfo}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                  />
                )}

                {/* Step 3: Payment */}
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

          {/* Order Summary Sidebar */}
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
