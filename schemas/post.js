// 포스트 스키마
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  writer: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// createAt & updateAt 자동으로 생성해주는 옵션
postSchema.set('timestamps', true);

module.exports = mongoose.model('Post', postSchema);
