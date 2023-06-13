const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');
const Comment = require('../schemas/comment');
const ObjectId = require('mongoose').Types.ObjectId;

// 조회
router.get('/posts', async (req, res) => {
  // posts 조회 sort매서드를 활용해서 내림차순으로 정렬
  const posts = await Post.find({}).sort({ createdAt: -1 });

  res.json({ posts });
});

router.get('/post/:id', async (req, res) => {
  // String => objectId로 변환해야 조회가능
  const oid = new ObjectId(req.params.id);
  const result = await Post.findOne({ _id: oid });

  res.json({ result });
});

// 생성
router.post('/post', async (req, res) => {
  const { writer, password, title, content } = req.body;
  // content 입력 안했을 때 메세지
  if (!content) res.json({ message: '포스트 내용을 입력해주세요' });

  // post 생성
  const result = await Post.create({ writer, password, title, content });

  res.json({ result });
});

// 삭제
router.delete('/post/:id', async (req, res) => {
  const { password } = req.body;
  const oid = new ObjectId(req.params.id);
  const post = await Post.findOne({ _id: oid });

  if (post.password === password) {
    //비밀번호가 일치할 때
    // 해당 Post삭제
    const postResult = await Post.deleteOne({ _id: oid });

    // 해당 Post와 연결된 댓글들 삭제
    const commentDeleteResult = await Comment.deleteMany({ postId: oid });
    res.json({ postResult, commentDeleteResult });
  } else {
    //비밀번호가 다를 때
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

// 수정
router.put('/post/:id', async (req, res) => {
  const oid = new ObjectId(req.params.id);
  const { content, password, title } = req.body;
  // content 입력 안했을 때 메세지
  if (!content) res.json({ message: '포스트 내용을 입력해주세요' });

  const post = await Post.findOne({ _id: oid });
  if (post.password === password) {
    // 비밀번호가 같다면
    const result = await Post.updateOne(
      { _id: oid },
      { $set: { content, title } },
    );
    res.json({ result });
  } else {
    res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
});

module.exports = router;
