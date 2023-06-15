const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment');
const ObjectId = require('mongoose').Types.ObjectId;

// 조회
router.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  // commnets 조회 sort매서드를 활용해서 내림차순으로 정렬
  const result = await Comment.find({ postId }).sort({
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
  const { postId } = req.params;
  // console.log(typeof postId); 결과 string => 몽구스에서는 스키마를 잘 작성해줬다면 objectId로 자동변환시켜줌

  // content 입력 안했을 때 메세지
  if (!content) res.json({ message: '댓글 내용을 입력해주세요' });

  // 댓글생성
  const result = await Comment.create({
    writer,
    password,
    content,
    postId, //postId추가
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
  const { commentId } = req.params;
  // 해당 id로 조회
  const commnet = await Comment.findOne({ _id: commentId });
  if (commnet.password === password) {
    // 비밀번호가 같다면
    const result = await Comment.deleteOne({ _id: commentId });
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
  const { commentId } = req.params;
  const { content, password } = req.body;

  // content 입력 안했을 때 메세지
  if (!content) res.status(400).json({ message: '댓글 내용을 입력해주세요' });

  const comment = await Comment.findOne({ _id: commentId });

  if (comment.password === password) {
    // 패스워드가 같다면
    const result = await Comment.updateOne(
      { _id: commentId },
      { $set: { content } },
    );
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
