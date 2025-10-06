import mongoose from "mongoose";

const StatusEnum = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const PaymentStatusEnum = ['pending', 'paid', 'failed', 'refunded', 'partial_refund'];

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      sku: String,
      category: String,
      material: String,
      priceType: {
        type: String,
        enum: ['fixed', 'weight-based']
      },
      // For weight-based items, store the rates at time of purchase
      goldRateAtPurchase: Number,
      silverRateAtPurchase: Number,
      weight: Number, // For weight-based items
      unitPrice: { type: Number, required: true }, // Price per item at time of purchase
      quantity: { type: Number, required: true, min: 1 },
      totalPrice: { type: Number, required: true }, // unitPrice * quantity
      image: String,
      // Additional jewelry-specific fields
      customization: {
        engraving: String,
        size: String,
        specialInstructions: String
      }
    }
  ],
  
  // Pricing breakdown
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  
  // Shipping information
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
    phone: { type: String, required: true },
    email: String,
    landmark: String
  },
  
  billingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    email: String,
    landmark: String,
    // If true, use shipping address for billing
    sameAsShipping: { type: Boolean, default: true }
  },
  
  // Payment information
  paymentMethod: { 
    type: String, 
    enum: ['COD', 'online', 'bank_transfer', 'upi', 'card'],
    default: "COD" 
  },
  paymentStatus: {
    type: String,
    enum: PaymentStatusEnum,
    default: 'pending',
    index: true
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paymentDate: Date,
    paymentReference: String
  },
  
  // Order status and tracking
  status: { 
    type: String, 
    enum: StatusEnum, 
    default: "pending", 
    index: true 
  },
  statusHistory: [
    {
      status: { type: String, enum: StatusEnum },
      at: { type: Date, default: Date.now },
      note: String,
      updatedBy: String // Admin name or system
    }
  ],
  
  // Shipping and tracking
  trackingNumber: String,
  shippingCarrier: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  
  // Customer information
  customerNotes: String,
  
  // Admin notes
  adminNotes: String,
  
  // Special flags for jewelry business
  isGiftOrder: { type: Boolean, default: false },
  giftMessage: String,
  giftWrapRequested: { type: Boolean, default: false },
  
  // Urgency and priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Return/Exchange information
  returnEligible: { type: Boolean, default: true },
  returnWindow: { type: Number, default: 7 }, // days
  
  // Discount and coupon information
  couponCode: String,
  discountType: String, // 'percentage', 'fixed', 'free_shipping'
  
  // Analytics and source tracking
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'store', 'social_media'],
    default: 'website'
  }
}, { 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'items.productId': 1 });

// Pre-save middleware to generate order number
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `ORD-${timestamp.slice(-8)}-${random}`;
  }
  next();
});

// Pre-save middleware to add status history
OrderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      at: new Date(),
      note: `Status changed to ${this.status}`,
      updatedBy: 'System'
    });
  }
  next();
});

// Virtual for order age in days
OrderSchema.virtual('orderAge').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
OrderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Instance method to calculate total weight (for shipping)
OrderSchema.methods.getTotalWeight = function() {
  return this.items.reduce((total, item) => {
    if (item.weight) {
      return total + (item.weight * item.quantity);
    }
    return total;
  }, 0);
};

// Instance method to check if order contains gold items
OrderSchema.methods.hasGoldItems = function() {
  return this.items.some(item => item.material === 'Gold');
};

// Instance method to check if order contains silver items
OrderSchema.methods.hasSilverItems = function() {
  return this.items.some(item => item.material === 'Silver');
};

// Static method to get orders by status
OrderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get pending orders
OrderSchema.statics.getPendingOrders = function() {
  return this.find({ 
    status: { $in: ['pending', 'confirmed', 'processing'] }
  }).sort({ priority: -1, createdAt: -1 });
};

// Static method to get orders requiring attention
OrderSchema.statics.getOrdersRequiringAttention = function() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  return this.find({
    $or: [
      { status: 'pending', createdAt: { $lt: threeDaysAgo } },
      { priority: 'urgent' },
      { paymentStatus: 'failed' }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
