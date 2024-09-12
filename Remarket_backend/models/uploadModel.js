const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  metadata: Object
});

module.exports = mongoose.model('Upload', uploadSchema, 'uploads.files');