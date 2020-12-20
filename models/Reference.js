
const mongoose = require('mongoose');

const ReferenceSchema = mongoose.Schema({
	article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article',
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model('reference', ReferenceSchema);
