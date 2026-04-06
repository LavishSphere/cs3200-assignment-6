/**
 * Query 2: Compute and print the total number of favorites in the dataset.
 * Creates a favoritesSum key in Redis and increments it by the favorite_count
 * of each tweet in MongoDB.
 */

async function query2(collection, redisClient) {
  await redisClient.set("favoritesSum", 0);

  const cursor = collection.find({});
  for await (const tweet of cursor) {
    const favoritesValue = tweet.favorite_count ?? tweet.favorites ?? 0;
    const favorites = Number(favoritesValue);
    if (!Number.isNaN(favorites) && favorites > 0) {
      await redisClient.incrBy("favoritesSum", favorites);
    }
  }

  const total = await redisClient.get("favoritesSum");
  console.log(`Total favorites: ${total}`);
}

module.exports = query2;
