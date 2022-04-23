const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
const mongoUrl = "mongodb://localhost:27017";

let _db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    console.log("connected");
    _db = client.db("shop");
    return client;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
