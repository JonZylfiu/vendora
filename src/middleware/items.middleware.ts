import { type Request, type Response, type NextFunction } from "express";
import redisClient from "../config/redis.config.js";
import { response } from "../utils/api-response.util.js";


export const getCachedItems = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const items = await redisClient.get(`items:page=${page}:limit=${limit}`);

    // check if it is requesting to fetch filtered items 
    // or items are not stored in cache 
    if(Object.keys(req.query).length > 0 || items == null) {
        return next();
    }

    return response(res, 200, null, JSON.parse(items));
}