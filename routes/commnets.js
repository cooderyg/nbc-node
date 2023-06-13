const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');
const Comment = require('../schemas/comment');
const ObjectId = require('mongoose').Types.ObjectId;

// 조회
router.get('/comments/:postId', async (req, res) => {
  // objectId로 변환
  const postOid = new ObjectId(req.params.postId);

  // commnets 조회 sort매서드를 활용해서 내림차순으로 정렬
  const comments = await Comment.find({ postId: postOid }).sort({
    createdAt: -1,
  });
  res.json({ comments });
});

// 생성
router.post('/comment/:postId', async (req, res) => {
  const { writer, password, content } = req.body;
  const postOid = new ObjectId(req.params.postId);

  // content 입력 안했을 때 메세지
  if (!content) res.json({ message: '댓글 내용을 입력해주세요' });

  // 댓글생성
  const result = await Comment.create({
    writer,
    password,
    content,
    postId: postOid,
  });
  res.json({ result });
});

// 삭제
router.delete('/comment/:id', async (req, res) => {
  const { password } = req.body;
  const oid = new ObjectId(req.params.id);
  // 해당 id로 조회
  const commnet = await Comment.findOne({ _id: oid });
  if (commnet.password === password) {
    // 비밀번호가 같다면
    const result = await Comment.deleteOne({ _id: oid });
    res.json({ result });
  } else {
    // 비밀번호가 다르다면
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

// 수정
router.put('/comment/:id', async (req, res) => {
  const oid = new ObjectId(req.params.id);
  const { content, password } = req.body;

  // content 입력 안했을 때 메세지
  if (!content) res.json({ message: '댓글 내용을 입력해주세요' });

  const comment = await Comment.findOne({ _id: oid });

  if (comment.password === password) {
    const result = await Comment.updateOne({ _id: oid }, { $set: { content } });
    res.json({ result });
  } else {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

module.exports = router;
