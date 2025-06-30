import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const pubClient: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
});

pubClient.on('error', (err: Error) => {
  console.error('Redis Client Error:', err);
});

const connectRedis = async (): Promise<void> => {
  try {
    await pubClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
};

export { pubClient, connectRedis };
