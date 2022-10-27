// @ts-check
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//passport --> 세션을 반드시 사용을 해야함.
const passport = require('passport');
require('dotenv').config();

const router = require('./routes/index');
const userRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const passportRouter = require('./routes/passport');
const chatRouter = require('./routes/chat');

passportRouter();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('mos'));
app.use(
  session({
    secret: 'mos',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
//passport -> 반드시 session 아래에서 사용을 해야함.
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);
app.use('/users', userRouter);
app.use('/posts', postsRouter);
app.use('/board', boardRouter);
app.use('/register', registerRouter.router);
app.use('/login', loginRouter.router);
app.use('/chat', chatRouter);

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log(`The express server is running at port: ${PORT}`);
});

// const express = require('express');
// const app = express();
// const userRouter = express.Router();
// const PORT = 4000;

// const USER = {
//   1: {
//     id: 'mos',
//     name: '모승환',
//   },
// };
// userRouter.get('/', (req, res) => {
//   res.send(USER);
// });

// userRouter.get('/:id', (req, res) => {
//   const userData = USER[req.params.id];
//   if (userData) {
//     res.send(userData);
//   } else {
//     res.end('ID not found');
//   }
// });

// userRouter.post('/', (req, res) => {
//   if (req.query.id && req.query.name) {
//     const newUser = {
//       id: req.query.id,
//       name: req.query.name,
//     };
//     USER[Object.keys(USER).length + 1] = newUser;
//     res.send('회원 등록 완료');
//   } else {
//     res.end('Unexpected query');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`The express server is running at port: ${PORT}`);
// });

// const express = require('express');
// const app = express();
// const PORT = 4000;
// app.get('/', (req, res) => {
//   res.send('GET request');
// });
// app.post('/', (req, res) => {
//   res.send('POST request');
// });
// app.put('/', (req, res) => {
//   res.send('PUT request');
// });
// app.delete('/', (req, res) => {
//   res.send('DELETE request');
// });

// app.listen(PORT, () => {
//   console.log(`The express server is running at port: ${PORT}`);
// });

// const express = require('express');

// const fs = require('fs');

// const app = express();
// const PORT = 4000;

// app.get('/:email/:id/:pw/:gender', (req, res) => {
//   console.log(req.params);
//   res.send(req.params);
// });

// app.get('/', (req, res) => {
//   if (req.query.email && req.query.pw && req.query.name && req.query.gender) {
//     res.send(req.query);
//   } else {
//     res.send('값 없음');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`The express server is running at port: ${PORT}`);
// });
