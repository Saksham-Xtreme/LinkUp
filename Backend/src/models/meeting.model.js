import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  meeting_code: {
    type: String,
    required: true,
    unique: true
  },

  date: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };