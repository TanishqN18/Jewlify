import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants', 'Other'] // Removed 'Gemstone' from categories
  },
  material: {
    type: String,
    required: true,
    enum: ['Gold', 'Silver', 'Platinum', 'Diamond', 'Mixed', 'Gemstone', 'Other'] // Kept 'Gemstone' in materials
  },
  mixedMetals: [{
    type: String,
    enum: [
      'Gold-Silver', 
      'Gold-Platinum', 
      'Silver-Platinum', 
      'Gold-Silver-Platinum',
      'Gold-Rose Gold',
      'White Gold-Yellow Gold'
    ]
  }],
  gemstones: [{
    type: String,
    enum: [
      'Ruby',
      'Sapphire',
      'Emerald',
      'Opal',
      'Topaz',
      'Amethyst',
      'Pearl',
      'Other'
    ]
  }],
  
  // Pricing structure
  priceType: {
    type: String,
    enum: ['fixed', 'weight-based'],
    required: true
  },
  
  // For fixed price items (like diamonds, finished jewelry)
  fixedPrice: {
    type: Number,
    required: function() { return this.priceType === 'fixed'; }
  },
  
  // For weight-based items (gold, silver)
  weight: {
    type: Number,
    required: function() { return this.priceType === 'weight-based'; }
  },
  
  // Stock management
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  
  // Additional properties
  sku: {
    type: String,
    required: true,
    trim: true,
    unique: true, // enforce uniqueness
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  
  // Status
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock', 'Discontinued'],
    default: 'Available'
  },
  
  // Sales tracking
  salesCount: { type: Number, default: 0 },
  
  inStock: { type: Boolean, default: true },

  // New fields for variants and customization options
  variants: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    attributes: {
      size: { type: String, required: true },
      color: { type: String, required: true }
    },
    priceAdjType: { type: String, enum: ['flat', 'percentage'], default: 'flat' },
    priceAdj: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    weightDiff: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'published' }
  }],
  customizationOptions: {
    allowEngraving: { type: Boolean, default: false },
    maxEngravingLength: { type: Number, default: 20 },
    allowSpecialInstructions: { type: Boolean, default: false },
    sizeOptions: [{ type: String }]
  },

  // New field for storing cover image URL
  coverImage: { type: String },

  // New field for storing image URLs
  imageUrls: [{ type: String }],

  // Add tags field
  tags: [{ type: String }]
}, {
  timestamps: true,
});

// Keep only this line
ProductSchema.index({ sku: 1 }, { unique: true });

// Pre-save middleware to generate SKU and update status
ProductSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.material.substring(0, 2).toUpperCase();
    this.sku = prefix + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  
  // Update status based on stock
  if (this.stock === 0) {
    this.status = 'Out of Stock';
    this.inStock = false;
  } else if (this.stock <= this.minStock) {
    this.status = 'Low Stock';
    this.inStock = true;
  } else {
    this.status = 'Available';
    this.inStock = true;
  }
  
  // Ensure mixedMetals is only used when material is 'Mixed'
  if (this.material !== 'Mixed' && this.mixedMetals.length > 0) {
    this.mixedMetals = [];
  }
  if (this.material === 'Mixed' && this.mixedMetals.length === 0) {
    return next(new Error('Mixed metal products must specify metal combinations'));
  }
  
  // Ensure gemstones is only used when material is 'Gemstone'
  if (this.material !== 'Gemstone' && this.gemstones.length > 0) {
    this.gemstones = [];
  }
  if (this.material === 'Gemstone' && this.gemstones.length === 0) {
    return next(new Error('Gemstone products must specify gemstone types'));
  }
  
  next();
});

// Method to calculate current price
ProductSchema.methods.getCurrentPrice = function(goldRate = 0, silverRate = 0) {
  if (this.priceType === 'fixed') {
    return this.fixedPrice;
  } else if (this.priceType === 'weight-based') {
    if (this.material === 'Gold') {
      return this.weight * goldRate;
    } else if (this.material === 'Silver') {
      return this.weight * silverRate;
    }
  }
  return 0;
};

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);