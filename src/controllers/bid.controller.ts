import type { Request, Response } from "express";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { createBid, deleteBid, getAllBidsByItemId, updateBid, getBidById } from "../services/bid.service.js";
import { response } from "../utils/api-response.util.js";

export const create = async (req: Request<{}, {}, BidRequestDto>, res: Response) => {
    const data = req.body; 
    const bid = await createBid(data, req.user);

    return response(res, 201, "Bid created successfully!", bid);
}

export const update = async (req: Request<{id: string}, {}, BidRequestDto>, res: Response) => {
    const { id } = req.params;
    const bid = await updateBid(id, req.body, req.user);
    
    return response(res, 200, "Bid updated successfully!", bid);
}

export const remove = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    await deleteBid(id, req.user);

    return response(res, 200, "Bid deleted successfully!", null);
}

export const getAllByItemId = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    const bids = await getAllBidsByItemId(id);

    return response(res, 200, "Bids retrieved successfully!", bids);
}

export const getById = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    const bid = await getBidById(id);

    return response(res, 200, null, bid);
}       
