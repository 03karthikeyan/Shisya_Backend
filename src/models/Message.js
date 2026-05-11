const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: String,   // store as string to avoid ObjectId vs string mismatch issues
      required: true,
      index: true,
    },
    receiver_id: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    is_read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Compound index for fast conversation queries
messageSchema.index({ sender_id: 1, receiver_id: 1, createdAt: -1 });
messageSchema.index({ receiver_id: 1, is_read: 1 });

module.exports = mongoose.model('Message', messageSchema);