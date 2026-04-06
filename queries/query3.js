/**
 * Query 3: Compute how many distinct users are there in the dataset.
 * Uses a Redis Set called screen_names to track unique users.
 */

async function query3(collection, redisClient) {
  await redisClient.del("screen_names");

  const cursor = collection.find({});
  for await (const tweet of cursor) {
    const screenName =
      (tweet.user && tweet.user.screen_name) || tweet.screen_name;
    if (screenName) {
      await redisClient.sAdd("screen_names", screenName);
    }
  }

  const distinctCount = await redisClient.sCard("screen_names");
  console.log(`There are ${distinctCount} distinct users`);
}

module.exports = query3;
