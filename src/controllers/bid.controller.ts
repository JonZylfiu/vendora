import type { Request, Response } from "express";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { createBidService, deleteBidService, getAllBidsByItemIdService, updateBidService, getBidByIdService } from "../services/bid.service.js";
import { response } from "../utils/api-response.util.js";

export const createBidController = async (req: Request<{}, {}, BidRequestDto>, res: Response) => {
    const data = req.body; 
    const bid = await createBidService(data, req.user);

    return response(res, 201, "Bid created successfully!", bid);
}

export const updateBidController = async (req: Request<{id: string}, {}, BidRequestDto>, res: Response) => {
    const { id } = req.params;
    const bid = await updateBidService(id, req.body, req.user);
    
    return response(res, 200, "Bid updated successfully!", bid);
}

export const deleteBidController = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    await deleteBidService(id, req.user);

    return response(res, 200, "Bid deleted successfully!", null);
}

export const getAllBidsByItemIdController = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    const bids = await getAllBidsByItemIdService(id);

    return response(res, 200, "Bids retrieved successfully!", bids);
}

export const getBidByIdController = async (req: Request<{id: string}, {}, {}>, res: Response) => {
    const { id } = req.params;
    const bid = await getBidByIdService(id);

    return response(res, 200, null, bid);
}       
