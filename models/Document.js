import mongoose from 'mongoose';

const DocumentSchema = mongoose.Schema(
  {
    fileName: String,
    document: [],
  },
  { timestamps: true }
);

let Document;

try {
  Document = mongoose.model('documents');
} catch (err) {
  Document = mongoose.model('documents', DocumentSchema);
}

export default Document;
