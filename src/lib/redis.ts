import Redis from "ioredis";

const redis = new Redis(6379, "localhost", {
  password: process.env.REDIS_PASSWORD,
});

export default redis;
