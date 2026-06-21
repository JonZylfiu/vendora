import { createClient } from "redis";


const redisClient = createClient({
    socket: {
        host: "127.0.0.1",
        port: Number(process.env.REDIS_PORT)
    }
})

redisClient.on("error", (err) => console.log("Redis Client Error", err))

export const connectRedis = async () => {
    await redisClient.connect();
};

export default redisClient;
