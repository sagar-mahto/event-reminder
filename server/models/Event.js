import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Combine date & time logically using ISO Date
    dateTime: {
      type: Date,
      required: true,
    },
    reminderAt: {
      type: Date,
      required: true,
      index: true,
    },

    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Helps cron performance
eventSchema.index({ reminderAt: 1, reminderSent: 1 });

export default mongoose.model("Event", eventSchema);
