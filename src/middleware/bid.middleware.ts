import { type Request, type Response, type NextFunction } from "express";
import redisClient from "../config/redis.config.js";
import { response } from "../utils/api-response.util.js";


export const getBidsByItemId = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const bids = await redisClient.lRange(`item:${req.params.id}:bids`, 0, -1);
    
    if(!bids) {
        next();
    }


    return response(res, 200, null, bids.map(bid => JSON.parse(bid)));
}