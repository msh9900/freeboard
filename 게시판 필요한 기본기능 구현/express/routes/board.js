const express = require('express');

const multer = require('multer');

const router = express.Router();

const fs = require('fs');

// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri =
//   'mongodb+srv://root:root@cluster0.rqpf5kr.mongodb.net/?retryWrites=true&w=majority';

//위에 mongdb 세팅을 mongo.js에 설정을 하고 모듈을 불러옴.
const mongoClient = require('./mongo');

const login = require('./login');

const dir = './uploads';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now());
  },
});
const limits = {
  fileSize: 1024 * 1028 * 2,
};

const upload = multer({ storage, limits });

router.get('/', login.isLogin, async (req, res) => {
  console.log(req.user);
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', {
    ARTICLE,
    articleCounts: articleLen,
    userId: req.session.userId
      ? req.session.userId
      : req.user?.id
      ? req.user?.id
      : req.signedCookies.user,
  });

  // 밑에 코드를 async await 처리를 해 가독성을 높임
  //   MongoClient.connect(uri, (err, db) => {
  //     const data = db.db('kdt1').collection('board');
  //     data.find({}).toArray((err, result) => {
  //       const ARTICLE = result;
  //       const articleLen = ARTICLE.length;
  //       res.render('board', { ARTICLE, articleCounts: articleLen });
  //     });
  //   });
});

router.get('/write', login.isLogin, (req, res) => {
  res.render('board_write');
});

router.post('/write', login.isLogin, upload.single('img'), async (req, res) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  console.log(req.file);
  if (req.body.title && req.body.content) {
    const newArticle = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      content: req.body.content,
      img: req.file ? req.file.filename : null,
    };

    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    await cursor.insertOne(newArticle);
    res.redirect('/board');

    // 밑에 코드 async await으로 수정.
    // MongoClient.connect(uri, (err, db) => {
    //   const data = db.db('kdt1').collection('board');
    //   data.insertOne(newArticle, (err, result) => {
    //     res.redirect('/board');
    //   });
    // });
  } else {
    const err = new Error('요청 이상');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/modify/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_modify', { selectedArticle });

  // 밑에 코드 async await으로 수정.
  //     MongoClient.connect(uri, (err, db) => {
  //     const data = db.db('kdt1').collection('board');
  //     data.findOne({ title: req.params.title }, (err, result) => {
  //       if (err) {
  //         throw err;
  //       } else {
  //         const selectedArticle = result;
  //         res.render('board_modify', { selectedArticle });
  //       }
  //     });
  //   });
});

router.post('/modify/title/:title', login.isLogin, async (req, res) => {
  if (req.body) {
    if (req.body.title && req.body.content) {
      const client = await mongoClient.connect();
      const cursor = client.db('kdt1').collection('board');
      await cursor.updateOne(
        { title: req.params.title },
        { $set: { title: req.body.title, content: req.body.content } }
      );
      res.redirect('/board');

      // 밑에 코드 async await으로 수정.
      //     MongoClient.connect(uri, (err, db) => {
      //     const data = db.db('kdt1').collection('board');
      //     data.updateOne(
      //       { title: req.params.title },
      //       { $set: { title: req.body.title, content: req.body.content } },
      //       (err, result) => {
      //         if (err) {
      //           res.send('해당 제목의 글이 없습니다');
      //         } else {
      //           res.redirect('/board');
      //         }
      //       }
      //     );
      //   });
    }
  }
});

router.delete('/delete/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }

  // 밑에 코드 async await으로 수정.
  //   MongoClient.connect(uri, (err, db) => {
  //     const data = db.db('kdt1').collection('board');
  //     data.deleteOne({ title: req.params.title }, (err, result) => {
  //       if (err) {
  //         throw err;
  //       } else {
  //         res.send('삭제 완료');
  //       }
  //     });
  //   });
});

module.exports = router;
