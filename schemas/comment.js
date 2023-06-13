// 댓글스키마
const mongoose = require('mongoose');

const commnetSchema = new mongoose.Schema({
  writer: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  // post에도 관계를 걸어서 comment[]를 둘 수 있음 성능은 비슷, 관계로 볼 때 one to many이기 때문에 지금이 맞음
});

commnetSchema.set('timestamps', true);

module.exports = mongoose.model('Commnet', commnetSchema);
