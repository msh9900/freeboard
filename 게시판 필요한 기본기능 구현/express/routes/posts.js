const express = require('express');

const router = express.Router();

const POST = [
  {
    title: 'asd',
    content: 'asd',
  },
  {
    title: 'test',
    content: 'test',
  },
];

router.get('/', (req, res) => {
  const contentLen = POST.length;
  res.render('posts', {
    POST,
    contentCounts: contentLen,
  });
});

router.get('/:title', (req, res) => {
  const contentData = POST.find((user) => user.title === req.params.title);
  if (contentData) {
    res.send(contentData);
  } else {
    const err = new Error('title not found');
    err.statusCode = 404;
    throw err;
  }
});
router.post('/', (req, res) => {
  if (Object.keys(req.query).length >= 1) {
    if (req.query.title && req.query.content) {
      const newContent = {
        title: req.query.title,
        content: req.query.content,
      };
      POST.push(newContent);
      res.send('회원 등록 완료');
    } else {
      const err = new Error('Unexpected query');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.title && req.body.content) {
      const newContent = {
        title: req.body.title,
        content: req.body.content,
      };
      POST.push(newContent);
      res.redirect('/posts');
    } else {
      const err = new Error('Unexpected query');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});
router.put('/:title', (req, res) => {
  console.log(req.params);
  console.log(req.query);
  if (req.query.title && req.query.content) {
    const contentData = POST.find((user) => user.title === req.params.title);
    if (contentData) {
      const arrIndex = POST.findIndex(
        (user) => user.title === req.params.title
      );
      const modifyUser = {
        title: req.query.title,
        content: req.query.content,
      };
      POST[arrIndex] = modifyUser;
      res.send('회원 수정완료 ');
    }
  } else {
    const err = new Error('title not found');
    err.statusCode = 404;
    throw err;
  }
});
router.delete('/:title', (req, res) => {
  const arrIndex = POST.findIndex((user) => user.title === req.params.title);
  if (arrIndex !== -1) {
    POST.splice(arrIndex, 1);
    res.send('회원 삭제 완료');
  } else {
    const err = new Error('title not found');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = router;
