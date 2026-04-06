/**
 * Query 1: How many tweets are there?
 * Creates a tweetCount key in Redis and increments it for each tweet in MongoDB.
 * Prints the total with a message "There were ### tweets".
 */

async function query1(collection, redisClient) {
  await redisClient.set("tweetCount", 0);

  const BATCH_SIZE = 1000;
  const cursor = collection.find({}, { projection: { _id: 1 } });
  let pending = 0;
  let pipeline = redisClient.multi();

  for await (const tweet of cursor) {
    pipeline.incr("tweetCount");
    pending += 1;

    if (pending >= BATCH_SIZE) {
      await pipeline.exec();
      pipeline = redisClient.multi();
      pending = 0;
    }
  }

  if (pending > 0) {
    await pipeline.exec();
  }

  const count = await redisClient.get("tweetCount");
  console.log(`There were ${count} tweets`);
}

module.exports = query1;
