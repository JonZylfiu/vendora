import type { Request, Response } from "express";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { createBid, deleteBid, getAllBidsByItemId, updateBid, getBidById } from "../services/bid.service.js";
import { response } from "../utils/api-response.util.js";

export const create = async (req: Request<{}, {}, BidRequestDto>, res: Response) => {
    const data = req.body; 
    const bid = await createBid(data, req.user);

    return response(bid, "Bid created successfully!", 201, res);
}

export const update = async (req: Request<{bidId: string}, {}, BidRequestDto>, res: Response) => {
    const { bidId } = req.params;
    const bid = await updateBid(bidId, req.body, req.user);
    
    return response(bid, "Bid updated successfully!", 200, res);
}

export const remove = async (req: Request<{bidId: string}, {}, {}>, res: Response) => {
    const { bidId } = req.params;
    await deleteBid(bidId, req.user);

    return response(null, "Bid deleted successfully!", 200, res);
}

export const getAllByItemId = async (req: Request<{itemId: string}, {}, {}>, res: Response) => {
    const { itemId } = req.params;
    const bids = await getAllBidsByItemId(itemId);

    return response(bids, "Bids retrieved successfully!", 200, res);
}

export const getById = async (req: Request<{bidId: string}, {}, {}>, res: Response) => {
    const { bidId } = req.params;
    const bid = await getBidById(bidId);

    return response(bid, null, 200, res);
}       
