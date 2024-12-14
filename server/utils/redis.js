const redis = require("redis");

const client = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

// on the connection
const connectToRedis = async () => {
  client.on("connect", () => console.log("Connected to Redis"));

  await client.connect();
};

connectToRedis();

module.exports = { client };
