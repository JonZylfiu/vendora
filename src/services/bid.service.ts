import type JwtPayload from "../types/jwt-payload.type.js";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toBidResponseDto } from "../mapper/bid.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import type IBid from "../models/interfaces/IBid.interface.js";
import { getOrderByItemId } from "./order.service.js";

export const createBid = async (data: BidRequestDto, user: JwtPayload) => {
    const { itemId, amount } = data;

    if(amount <= 0 || isNaN(amount)) {
        throw new BadRequestError({
            message: "Amount should be bigger than zero!"
        });
    }

    await isValidToBid(itemId, amount);

    const bid = await Bid.create({
        itemId,
        bidderId: user.id,
        amount,
        highestBid: await highestBidAmount(itemId) < amount
    });

    const populatedBid = await bid.populate(["itemId", "bidderId"]);

    return toBidResponseDto(populatedBid);
}

export const updateBid = async (bidId: string, data: BidRequestDto, user: JwtPayload) => {
    const { amount } = data
    
    if(amount <= 0 || isNaN(amount)) {
        throw new BadRequestError({
            message: "Amount should be bigger than zero!"
        });
    }

    const bid = await getEntityById(bidId, Bid);

    await isValidToBid(bid.itemId.toString(), amount);

    checkIsAuthorized(bid.bidderId, user);

    const highestAmount = await highestBidAmount(bid.itemId.toString());
    const isHighestBid = highestAmount === bid.amount;

    if(!isHighestBid) {
        throw new BadRequestError({
            message: "Your bid should be higher than the current highest bid!"
        });
    }

    if(isHighestBid && amount < highestAmount) {
        throw new BadRequestError({
            message: "Your bid should be higher than the current highest bid!"
        });
    }

    bid.amount = amount;
    bid.highestBid = highestAmount < amount;
    await bid.save();

    const populatedBid = await bid.populate(["itemId", "bidderId"]);

    return toBidResponseDto(populatedBid);
}

export const deleteBid = async (bidId: string, user: JwtPayload) => {
    const bid = await getEntityById(bidId, Bid);

    if(bid.highestBid) {
        throw new BadRequestError({
            message: "You cannot delete the highest bid!"
        });
    }

    checkIsAuthorized(bid.bidderId, user);

    const deletedBid = await bid.deleteOne();
    return deletedBid.deletedCount == 1;
}   

export const getAllBidsByItemId = async (itemId: string) => {
    const item = await getEntityById(itemId, Item);

    const bids = await Bid.find({ itemId: item._id }).populate(["itemId", "bidderId"]).sort({ amount: -1 });
    
    return bids.map(bid => toBidResponseDto(bid));
}

export const getHighestBidByItemId = async (itemId: string): Promise<IBid | null> => {
    const highestBid = await Bid.findOne({ itemId }).sort({ amount: -1 });

    if(!highestBid) {
        return null;
    }

    return highestBid;
}

const highestBidAmount = async (itemId: string) => {
    const highestBid  = await getHighestBidByItemId(itemId);

    const highestAmount = highestBid?.amount || 0;

    return highestAmount;
}    

const isValidToBid = async (itemId: string, amount: number) => {
    const item = await getEntityById(itemId, Item);
    const highestAmount = await highestBidAmount(itemId);
    const order = await getOrderByItemId(itemId);
    

    if(order) {
        throw new BadRequestError({
            message: "You cannot bid in this order anymore!"
        });
    }

    if(item.state == ItemStatesEnum.SOLD) {
        throw new BadRequestError({
            message: "You cannot bid for a sold item!"
        });
    }

    if(item.state == ItemStatesEnum.ARCHIVED) {
        throw new BadRequestError({
            message: "You cannot bid for an archived item!"
        });
    }

    if(amount < item.startingPrice) {  
        throw new BadRequestError({
            message: "Bid amount must be equal to or higher than the starting price!"
        });
    }

    if(amount <= highestAmount) {  
        throw new BadRequestError({
            message: "Bid amount must be higher than the current highest bid!"
        });
    }
}



