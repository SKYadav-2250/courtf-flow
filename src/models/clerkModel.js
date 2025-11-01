import mongoose from 'mongoose';

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
    unique: true
  },
  phone: {
    type: String,
    required: true,
 
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

export default mongoose.model('Clerk', clerkSchema);
