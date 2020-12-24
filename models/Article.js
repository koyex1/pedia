
const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
subtopic:{
  type: mongoose.Schema.Types.ObjectId,
    ref: 'subtopic',
  },
  title: {
    type: String,
    required: false,
  },
  lastedited: {
    type: String,
    required: false,
  },
  imagepath:{
  type:String,
  required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('article', ArticleSchema);
