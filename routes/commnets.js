const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const ObjectId = require('mongoose').Types.ObjectId;

// 조회
router.get('/comments/:postId', async (req, res) => {
  // objectId로 변환
  const postOid = new ObjectId(req.params.postId);

  // commnets 조회 sort매서드를 활용해서 내림차순으로 정렬
  const result = await Comment.find({ postId: postOid }).sort({
    //내림차순 -1 오름차순 1
    createdAt: -1,
  });
  res.status(200).json({
    data: {
      result,
    },
  });
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
    postId: postOid, //postId추가
  });
  res.status(200).json({
    data: {
      result,
    },
  });
});

// 삭제
router.delete('/comment/:commentId', async (req, res) => {
  const { password } = req.body;
  const oid = new ObjectId(req.params.commentId);
  // 해당 id로 조회
  const commnet = await Comment.findOne({ _id: oid });
  if (commnet.password === password) {
    // 비밀번호가 같다면
    const result = await Comment.deleteOne({ _id: oid });
    res.status(200).json({
      data: {
        result,
      },
    });
  } else {
    // 비밀번호가 다르다면
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

// 수정
router.put('/comment/:commentId', async (req, res) => {
  const oid = new ObjectId(req.params.commentId);
  const { content, password } = req.body;

  // content 입력 안했을 때 메세지
  if (!content) res.status(400).json({ message: '댓글 내용을 입력해주세요' });

  const comment = await Comment.findOne({ _id: oid });

  if (comment.password === password) {
    // 패스워드가 같다면
    const result = await Comment.updateOne({ _id: oid }, { $set: { content } });
    res.status(200).json({
      data: {
        result,
      },
    });
  } else {
    // 패스워드가 다르다면
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

module.exports = router;
