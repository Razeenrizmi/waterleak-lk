import mongoose from 'mongoose';

// Minimal stub — extend/merge with the auth module's User model once login lands.
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Citizen User' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['citizen', 'admin'],
      default: 'citizen'
    },
    blocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
