import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: String,
  line1: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
  isDefault: Boolean
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  cardType: String,
  last4: String,
  expiry: String,
  isDefault: Boolean
}, { _id: false });

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: String,
  gender: String,
  image: String, // base64
  addresses: [addressSchema],
  paymentMethods: [paymentSchema],
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager'],
    default: 'customer'
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
