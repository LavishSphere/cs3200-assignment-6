/**
 * Query 4: Create a leaderboard with the top 10 users with more tweets.
 * Uses a Redis Sorted Set called leaderboard, scored by tweet count.
 */

async function query4(collection, redisClient) {
  await redisClient.del("leaderboard");

  const cursor = collection.find({});
  for await (const tweet of cursor) {
    const screenName =
      (tweet.user && tweet.user.screen_name) || tweet.screen_name;
    if (screenName) {
      await redisClient.zIncrBy("leaderboard", 1, screenName);
    }
  }

  const top10 = await redisClient.zRangeWithScores("leaderboard", 0, 9, {
    REV: true,
  });

  console.log("Top 10 users by tweet count:");
  top10.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.value}: ${entry.score} tweets`);
  });
}

module.exports = query4;
