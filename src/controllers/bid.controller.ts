import type { Request, Response } from "express";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { createBid, deleteBid, getAllBidsByItemId, updateBid, getBidById } from "../services/bid.service.js";
import { response } from "../utils/api-response.util.js";

export const create = async (req: Request<{}, {}, BidRequestDto>, res: Response) => {
    const data = req.body; 
    const bid = await createBid(data, req.user);

    return response(bid, "Bid created successfully!", 201, res);
}

export const update = async (req: Request<{id: string}, {}, BidRequestDto>, res: Response) => {
    const { id } = req.params;
    const bid = await updateBid(id, req.body, req.user);
    
    return response(bid, "Bid updated successfully!", 200, res);
}

export const remove = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    await deleteBid(id, req.user);

    return response(null, "Bid deleted successfully!", 200, res);
}

export const getAllByItemId = async (req: Request<{itemId: string}, {}, {}>, res: Response) => {
    const { itemId } = req.params;
    const bids = await getAllBidsByItemId(itemId);

    return response(bids, "Bids retrieved successfully!", 200, res);
}

export const getById = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    const bid = await getBidById(id);

    return response(bid, null, 200, res);
}       
