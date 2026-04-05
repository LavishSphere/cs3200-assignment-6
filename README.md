# cs3200-assignment-6
## Use Redis

### By: Ashsmith Khayrul

**Loading the data**
- Download the tweets generated during the 2020 ieeevis Conference: https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2
- Unzip the file. After extraction you should have a .dump
- Import the file using mongoimport into the `ieeevisTweets` database, `tweet` collection

Queries can be found in [queries](./queries).
Before running the queries, make sure both MongoDB and Redis are running locally, then install dependencies with `npm install` and run `npm start`.

- Query1: How many tweets are there?

- Query2: Compute and print the total number of favorites in the dataset.

- Query3: Compute how many distinct users are there in the dataset.

- Query4: Create a leaderboard with the top 10 users with more tweets.

- Query5: Create a structure to retrieve all tweets for a specific user.
    - Uses Redis Lists (`tweets:<screen_name>`) to store tweet IDs per user
    - Uses Redis Hashes (`tweet:<id>`) to store tweet attributes for fast lookup