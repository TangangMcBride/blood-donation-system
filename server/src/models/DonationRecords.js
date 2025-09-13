
import mongoose from "mongoose";

const BloodRequestSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  requesterRole: { type: String, enum: ["Hospital","Patient"], required: true },
  patientName: { type: String },
  bloodType: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  urgency: { type: String, enum: ["Normal","Urgent"], default: "Normal" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined } // [lng, lat]
  },
  status: { type: String, enum: ["Open","Matched","Closed"], default: "Open" },
  matchedDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

BloodRequestSchema.index({ location: "2dsphere" });


export default mongoose.model("BloodRequest", BloodRequestSchema);