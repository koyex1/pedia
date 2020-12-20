
const mongoose = require('mongoose');

const SubtopicSchema = mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'article',
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  imagepath:{
	type: String,
	required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('subtopic', SubtopicSchema);
