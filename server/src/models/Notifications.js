import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Info', 'Alert', 'Request', 'Success', 'Warning'],
      default: 'Info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedEntity: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntityType',
    },
    relatedEntityType: {
      type: String,
      enum: ['BloodRequest', 'User', 'Donation'],
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model('Notification', NotificationSchema);