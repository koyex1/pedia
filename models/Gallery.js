
const mongoose = require('mongoose');

const GallerySchema = mongoose.Schema({
  subtopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subtopic',
  },
  imagepath: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('gallery', GallerySchema);
