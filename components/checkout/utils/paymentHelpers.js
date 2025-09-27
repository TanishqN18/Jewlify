// Format card number with spaces
export const formatCardNumber = (value) => {
  // Remove all non-digit characters
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  
  // Add spaces every 4 digits
  const matches = v.match(/\d{4,16}/g);
  const match = matches && matches[0] || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

// Format expiry date MM/YY
export const formatExpiryDate = (value) => {
  // Remove all non-digit characters
  const v = value.replace(/\D/g, '');
  
  if (v.length >= 2) {
    const month = v.substring(0, 2);
    const year = v.substring(2, 4);
    
    // Validate month
    if (parseInt(month) > 12) {
      return '12';
    }
    
    return month + (year ? '/' + year : '');
  }
  
  return v;
};

// Format CVV (only digits)
export const formatCVV = (value) => {
  return value.replace(/\D/g, '').substring(0, 4);
};

// Format UPI ID
export const formatUpiId = (value) => {
  return value.toLowerCase().replace(/[^a-z0-9@.\-_]/g, '');
};

// Format phone number
export const formatPhoneNumber = (value) => {
  // Remove all non-digit characters except +
  const v = value.replace(/[^\d+]/g, '');
  
  // If starts with +91, format as +91 XXXXX XXXXX
  if (v.startsWith('+91')) {
    const number = v.substring(3);
    if (number.length > 5) {
      return `+91 ${number.substring(0, 5)} ${number.substring(5, 10)}`;
    } else {
      return `+91 ${number}`;
    }
  }
  
  // If starts with 91, format as +91 XXXXX XXXXX
  if (v.startsWith('91') && v.length > 2) {
    const number = v.substring(2);
    if (number.length > 5) {
      return `+91 ${number.substring(0, 5)} ${number.substring(5, 10)}`;
    } else {
      return `+91 ${number}`;
    }
  }
  
  // If 10 digits, format as +91 XXXXX XXXXX
  if (v.length === 10) {
    return `+91 ${v.substring(0, 5)} ${v.substring(5)}`;
  }
  
  return v;
};

// Detect card type
export const detectCardType = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  const cardTypes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    rupay: /^6[0-9]{15}$/,
    maestro: /^(5[06789]|6)[0-9]{0,17}$/
  };

  for (const [type, regex] of Object.entries(cardTypes)) {
    if (regex.test(number)) {
      return type;
    }
  }
  
  return 'unknown';
};

// Get card type icon
export const getCardIcon = (cardType) => {
  const icons = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    rupay: '💳',
    maestro: '💳',
    unknown: '💳'
  };
  
  return icons[cardType] || icons.unknown;
};

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber) => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(number)) {
    return false;
  }
  
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
};

// Check if expiry date is valid and not expired
export const validateExpiryDate = (expiryDate) => {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return { isValid: false, message: 'Invalid format. Use MM/YY' };
  }
  
  const [month, year] = expiryDate.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const now = new Date();
  
  // Set to end of expiry month
  expiry.setMonth(expiry.getMonth() + 1);
  expiry.setDate(0);
  
  if (expiry < now) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true, message: '' };
};

// Generate payment reference ID
export const generatePaymentReference = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PAY_${timestamp}_${randomStr}`.toUpperCase();
};

// Calculate processing fee (if any)
export const calculateProcessingFee = (amount, paymentMethod) => {
  const fees = {
    card: amount * 0.02, // 2% for cards
    upi: amount * 0.005, // 0.5% for UPI
    cod: 50 // Fixed ₹50 for COD
  };
  
  return fees[paymentMethod] || 0;
};

// Get payment method display name
export const getPaymentMethodName = (method) => {
  const names = {
    card: 'Credit/Debit Card',
    upi: 'UPI Payment',
    cod: 'Cash on Delivery'
  };
  
  return names[method] || method;
};

// Get payment method icon
export const getPaymentMethodIcon = (method) => {
  const icons = {
    card: '💳',
    upi: '📱',
    cod: '💰'
  };
  
  return icons[method] || '💳';
};

// Mock payment processing function
export const processPayment = async (paymentInfo, orderDetails) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate payment reference
  const reference = generatePaymentReference();
  
  // Mock payment gateway response
  const mockResponse = {
    success: Math.random() > 0.1, // 90% success rate
    reference,
    transactionId: `TXN_${reference}`,
    amount: orderDetails.total,
    paymentMethod: paymentInfo.paymentMethod,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };
  
  if (!mockResponse.success) {
    throw new Error('Payment failed. Please try again.');
  }
  
  return mockResponse;
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate EMI options
export const calculateEMI = (amount, months = [3, 6, 9, 12, 18, 24]) => {
  const interestRate = 0.12; // 12% annual interest rate
  
  return months.map(month => {
    const monthlyRate = interestRate / 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, month)) / 
                (Math.pow(1 + monthlyRate, month) - 1);
    
    return {
      months: month,
      emi: Math.round(emi),
      totalAmount: Math.round(emi * month),
      interest: Math.round((emi * month) - amount)
    };
  });
};