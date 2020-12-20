
const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({

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
