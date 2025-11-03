import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema({
  judgeId: { type: String, required: true, unique: true }, // unique Judge ID
  name: { type: String, required: true },
  court: String,
  experience: Number,
  number: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
  },
  role: {
    type: String,
    default: "judge",
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
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
});

export default mongoose.model("Judge", judgeSchema);
