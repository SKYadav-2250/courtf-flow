const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema(
  {
    lawyerId: {
      type: String,
      required: true,
      unique: true // Custom ID like L6578
    },
    name: {
      type: String,
      required: true
    },
    barNumber: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Criminal Law",
        "Civil Law",
        "Corporate Law",
        "Family Law",
        "Tax Law",
        "Constitutional Law",
        "Property Law",
        "Intellectual Property Law",
        "Other"
      ]
    },
    cases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lawyer", lawyerSchema);
