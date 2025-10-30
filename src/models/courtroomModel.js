const mongoose = require('mongoose');

const courtroomSchema = new mongoose.Schema({
  courtroomId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: false
  }
});

// ✅ Auto-increment courtroomId before saving
courtroomSchema.pre('save', async function (next) {
  if (!this.courtroomId) {
    const lastCourtroom = await mongoose.model('Courtroom').findOne().sort({ courtroomId: -1 });
    this.courtroomId = lastCourtroom ? lastCourtroom.courtroomId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Courtroom', courtroomSchema);
