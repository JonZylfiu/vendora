import type BidResponseDto from "../dtos/bid/bid-response.dto.js";
import type IUser from "../models/interfaces/IUser.interface.js";
import type IBid from "../models/interfaces/IBid.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";


export const toBidResponseDto = (bid: IBid): BidResponseDto => {
    const {_id, amount, createdAt } = bid;

    const bidder = bid.bidderId as unknown as IUser;
    const item = bid.itemId as unknown as IItem;
    
    return {
        id: _id.toString(),
        bidderFullName: `${bidder.name} ${bidder.surname}`,
        bidderPhone: bidder.phone,
        item: {
            id: item._id.toString(),
            title: item.title
        },
        bidAmount: amount,
        createdAt
    };
};