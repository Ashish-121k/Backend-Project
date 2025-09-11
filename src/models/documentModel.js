// /models/documentModel.js
import mongoose from 'mongoose';

const documentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This MUST match the name of the existing user model
    },
    originalFilename: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
    },
    summary: {
      type: String,
    },
    processedImage: { 
      type: String, // Base64 string of the image with bounding boxes
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;