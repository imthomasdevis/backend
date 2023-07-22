require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
console.log("uri", uri);
// DB IS PROTECTED BY IP ADDRESS

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let dbData;
const dbName = process.env.DB_NAME;
const msgCollection = process.env.MSG_COLLECTION;

const connection = async () => {
  await client.connect();
  dbData = client.db(dbName).collection(msgCollection);
};

const insertDoc = async (doc) => {
  if (!dbData) await connection();
  const insertedId = await dbData.insertOne(doc).then((res) => res.insertedId);
  return insertedId;
};

const checkUser = async (email) => {
  if (!dbData) await connection();
  const user = await dbData.findOne({ email: email });
  if (user) return { user_type: "OLD_USER", timestamp: user.timestamp };
  return {
    user_type: "NEW_USER",
    timestamp: new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  };
};

const updateDoc = async (email, updates) => {
  if (!dbData) await connection();
  const query = { email };
  const update = {
    $push: { messages: { $each: updates } },
  };
  const modifiedCount = await dbData
    .updateOne(query, update)
    .then((res) => res.modifiedCount);
  return modifiedCount;
};

const readDoc = async (email) => {
  if (!dbData) await connection();
  const doc = await dbData.findOne({ email }).then((res) => res);
  return doc;
};

module.exports = {
  connection,
  insertDoc,
  readDoc,
  checkUser,
  updateDoc,
};
