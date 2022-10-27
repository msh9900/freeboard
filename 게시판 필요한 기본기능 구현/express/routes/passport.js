const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KaKaoStrartegy = require('passport-kakao').Strategy;

const verifyModule = require('./register').verifyPassword;

const mongoClient = require('./mongo');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('kdt1').collection('users');
        const result = await userCursor.findOne({ id });
        if (result !== null) {
          // 아틀라스 사용 변수 제거
          if (result.salt !== undefined) {
            const passwordresult = verifyModule(
              password,
              result.salt,
              result.password
            );
            if (passwordresult) {
              cb(null, result);
            } else {
              cb(null, false, { message: '비밀번호가 틀렸습니다.' });
            }
          } else if (result.password === password) {
            cb(null, result);
          } else {
            cb(null, false, { message: '비밀번호가 틀렸습니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id가 없습니다.' });
        }
      }
    )
  );
};

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CB_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('kdt1').collection('users');
      const result = await userCursor.findOne({ id: profile.id });
      if (result !== null) {
        cb(null, result);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '네이버 회원 생성 에러' });
        }
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CB_URL,
    },

    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('kdt1').collection('users');
      const result = await userCursor.findOne({ id: profile.id });
      if (result !== null) {
        cb(null, result);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '회원 생성 에러' });
        }
      }
    }
  )
);
passport.use(
  new KaKaoStrartegy(
    {
      clientID: process.env.KAKAO_CLIENT,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CB_URL,
    },

    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const client = await mongoClient.connect();
      const userCursor = client.db('kdt1').collection('users');
      const result = await userCursor.findOne({ id: profile.id });
      if (result !== null) {
        cb(null, result);
      } else {
        const newUser = {
          id: profile.id,
          name:
            profile.displayName !== undefined
              ? profile.displayName
              : profile.emails[0].value,
          provider: profile.provider,
        };
        const dbResult = await userCursor.insertOne(newUser);
        if (dbResult.acknowledged) {
          cb(null, newUser);
        } else {
          cb(null, false, { message: '회원 생성 에러' });
        }
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const client = await mongoClient.connect();
  const userCursor = client.db('kdt1').collection('users');
  const result = await userCursor.findOne({ id });
  if (result) cb(null, result);
});
