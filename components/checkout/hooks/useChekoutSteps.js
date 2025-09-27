'use client';

import { useState } from 'react';

export function useCheckoutSteps() {
  const [step, setStep] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: ''
  });

  return {
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
  };
}