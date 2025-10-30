const mongoose = require('mongoose');

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
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true  // ✅ Prevent duplicate phone numbers
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

module.exports = mongoose.model('Clerk', clerkSchema);
