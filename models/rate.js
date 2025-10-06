import mongoose from "mongoose";

const RateSchema = new mongoose.Schema({
  goldRate: { 
    type: Number, 
    required: true,
    min: 0
  },
  silverRate: { 
    type: Number, 
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: { 
    type: String, 
    required: true 
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
});

// Ensure only one active rate at a time
RateSchema.pre('save', async function(next) {
  if (this.isActive) {
    // Deactivate all other rates
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

export default mongoose.models.Rate || mongoose.model("Rate", RateSchema);