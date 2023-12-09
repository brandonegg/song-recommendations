import Redis from "ioredis";

const redis = new Redis(6379, "redis", {
  password: process.env.REDIS_PASSWORD,
  db: 0,
});

export default redis;
