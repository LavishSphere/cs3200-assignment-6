/**
 * Query 5: Create a structure to retrieve all tweets for a specific user.
 * - Uses Redis Lists (tweets:<screen_name>) to store tweet IDs per user.
 * - Uses Redis Hashes (tweet:<id>) to store all tweet attributes.
 */

async function query5(collection, redisClient) {
  // Clear all existing tweet list and hash keys from previous runs
  const existingListKeys = await redisClient.keys("tweets:*");
  const existingHashKeys = await redisClient.keys("tweet:*");
  const allKeys = [...existingListKeys, ...existingHashKeys];
  if (allKeys.length > 0) {
    await redisClient.del(allKeys);
  }

  // I selected user tamaramunzner who has 75 tweets in the dataset.
  const targetUser = "tamaramunzner";

  const cursor = collection.find({});
  for await (const tweet of cursor) {
    const screenName =
      (tweet.user && tweet.user.screen_name) || tweet.screen_name;
    const tweetId = tweet.id_str || String(tweet.id || tweet._id);

    if (!screenName || !tweetId) continue;

    await redisClient.rPush(`tweets:${screenName}`, tweetId);

    await redisClient.hSet(`tweet:${tweetId}`, {
      id: tweetId,
      user_name: screenName,
      text: tweet.text || "",
      created_at: tweet.created_at || "",
      favorite_count: String(Number(tweet.favorite_count ?? tweet.favorites ?? 0) || 0),
      retweet_count: String(tweet.retweet_count ?? 0),
      lang: tweet.lang || "",
      source: tweet.source || "",
      in_reply_to_screen_name: tweet.in_reply_to_screen_name || "",
      in_reply_to_user_id_str: tweet.in_reply_to_user_id_str || "",
      is_retweet: String(!!(tweet.retweeted_status)),
    });
  }

  const tweetIds = await redisClient.lRange(`tweets:${targetUser}`, 0, -1);
  console.log(
    `User "${targetUser}" has ${tweetIds.length} tweet(s): [${tweetIds.join(", ")}]`
  );

  if (tweetIds.length > 0) {
    const tweetData = await redisClient.hGetAll(`tweet:${tweetIds[0]}`);
    console.log(`Details of tweet ${tweetIds[0]}:`, tweetData);
  }

  console.log(
    "Query 5 complete: tweet lists and hashes populated in Redis."
  );
}

module.exports = query5;

// Claude Code was used for debugging in this file