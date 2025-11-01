import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema({
  judgeId: { type: String, required: true, unique: true }, // unique Judge ID
  name: { type: String, required: true },
  court: String,
  experience: Number,
  contact: String,
  role:{
    type:String,
    default:'judge'
    
  },    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
});

export default mongoose.model("Judge", judgeSchema);
