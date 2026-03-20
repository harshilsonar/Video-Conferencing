import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    givenTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Ek user ek session me ek hi baar feedback de
feedbackSchema.index({ session: 1, givenBy: 1 }, { unique: true });

export default mongoose.model("Feedback", feedbackSchema);