const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

const query1 = require("./queries/query1");
const query2 = require("./queries/query2");
const query3 = require("./queries/query3");
const query4 = require("./queries/query4");
const query5 = require("./queries/query5");

const MONGO_URI = "mongodb://localhost:27017";
const MONGO_DB = "ieeevisTweets";
const MONGO_COLLECTION = "tweet";

async function main() {
  const mongoClient = new MongoClient(MONGO_URI);
  const redisClient = createClient();

  redisClient.on("error", (err) => console.error("Redis error:", err));

  await mongoClient.connect();
  await redisClient.connect();

  try {
    const collection = mongoClient.db(MONGO_DB).collection(MONGO_COLLECTION);

    await query1(collection, redisClient);
    await query2(collection, redisClient);
    await query3(collection, redisClient);
    await query4(collection, redisClient);
    await query5(collection, redisClient);
  } finally {
    await mongoClient.close();
    await redisClient.quit();
  }
}

main().catch(console.error);
