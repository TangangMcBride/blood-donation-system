import mongoose from 'mongoose';

const BloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      uppercase: true,
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      address: String,
      city: String,
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    status: {
      type: String,
      enum: ['Open', 'Matched', 'InProgress', 'Completed', 'Cancelled'],
      default: 'Open',
    },
    matchedDonors: [{
      donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined', 'Donated'],
        default: 'Pending',
      },
      responseDate: Date,
    }],
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

BloodRequestSchema.index({ location: '2dsphere' });

export default mongoose.model('BloodRequest', BloodRequestSchema);