import type BidResponseDto from "../dtos/bid/bid-response.dto.js";
import type IUser from "../models/interfaces/IUser.interface.js";
import type IBid from "../models/interfaces/IBid.interface.js";


export const toBidResponseDto = (bid: IBid): BidResponseDto => {
    const {_id, amount, createdAt } = bid;

    const bidder = bid.bidderId as unknown as IUser;
    
    return {
        id: _id.toString(),
        bidderFullName: `${bidder.name} ${bidder.surname}`,
        bidAmount: amount,
        createdAt
    };
};