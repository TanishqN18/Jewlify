export const shippingValidation = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'First name must be 2-50 characters and contain only letters'
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Last name must be 2-50 characters and contain only letters'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: true,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number'
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 200,
    message: 'Address must be between 10-200 characters'
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'City must be 2-50 characters and contain only letters'
  },
  state: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'State must be 2-50 characters and contain only letters'
  },
  zipCode: {
    required: true,
    pattern: /^[1-9][0-9]{5}$/,
    message: 'Please enter a valid 6-digit PIN code'
  },
  country: {
    required: true,
    message: 'Country is required'
  }
};

export const paymentValidation = {
  card: {
    cardNumber: {
      required: true,
      pattern: /^[0-9\s]{13,19}$/,
      message: 'Please enter a valid card number'
    },
    expiryDate: {
      required: true,
      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      message: 'Please enter expiry date in MM/YY format'
    },
    cvv: {
      required: true,
      pattern: /^[0-9]{3,4}$/,
      message: 'Please enter a valid CVV'
    },
    cardName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Cardholder name must be 2-50 characters and contain only letters'
    }
  },
  upi: {
    upiId: {
      required: true,
      pattern: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
      message: 'Please enter a valid UPI ID (e.g., user@paytm)'
    }
  }
};

// Validation function
export const validateField = (fieldName, value, validationRule) => {
  if (!validationRule) return { isValid: true, message: '' };

  // Check if required
  if (validationRule.required && (!value || value.trim() === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  // Skip further validation if field is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true, message: '' };
  }

  const trimmedValue = value.trim();

  // Check minimum length
  if (validationRule.minLength && trimmedValue.length < validationRule.minLength) {
    return { isValid: false, message: validationRule.message || `${fieldName} is too short` };
  }

  // Check maximum length
  if (validationRule.maxLength && trimmedValue.length > validationRule.maxLength) {
    return { isValid: false, message: validationRule.message || `${fieldName} is too long` };
  }

  // Check pattern
  if (validationRule.pattern && !validationRule.pattern.test(trimmedValue)) {
    return { isValid: false, message: validationRule.message || `Invalid ${fieldName} format` };
  }

  return { isValid: true, message: '' };
};

// Validate entire form
export const validateForm = (formData, schema) => {
  const errors = {};
  let isFormValid = true;

  Object.keys(schema).forEach(fieldName => {
    const validation = validateField(fieldName, formData[fieldName], schema[fieldName]);
    if (!validation.isValid) {
      errors[fieldName] = validation.message;
      isFormValid = false;
    }
  });

  return { isValid: isFormValid, errors };
};

// Validate shipping form
export const validateShippingForm = (shippingInfo) => {
  return validateForm(shippingInfo, shippingValidation);
};

// Validate payment form
export const validatePaymentForm = (paymentInfo) => {
  const { paymentMethod } = paymentInfo;
  
  if (paymentMethod === 'card') {
    return validateForm(paymentInfo, paymentValidation.card);
  } else if (paymentMethod === 'upi') {
    return validateForm(paymentInfo, paymentValidation.upi);
  } else if (paymentMethod === 'cod') {
    return { isValid: true, errors: {} };
  }
  
  return { isValid: false, errors: { paymentMethod: 'Please select a payment method' } };
};