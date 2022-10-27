const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI_ATLAS;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;

// async function main() {
//   await client.connect();
//   const users = client.db('kdt1').collection('users');
//   await users.deleteMany({});
//   await users.insertMany([
//     {
//       name: 'pororo',
//       age: 5,
//     },
//     {
//       name: 'loopy',
//       age: 6,
//     },
//     {
//       name: 'crong',
//       age: 4,
//     },
//   ]);
//   const data = users.find({});
//   const arr = await data.toArray();
//   console.log(arr);

//   await client.close();
// }

// main();
