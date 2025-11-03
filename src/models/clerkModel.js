import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const clerkSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
      password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  number: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
  },
       role:{
    type:String,
    default:'clerk'
    
  },
  assignedCourtroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courtroom', // ✅ Must exactly match model name
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

clerkSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

export default mongoose.model('Clerk', clerkSchema);
