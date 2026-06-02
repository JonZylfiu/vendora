import type JwtPayload from "../types/jwt-payload.type.js";
import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toBidResponseDto } from "../mapper/bid.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";

export const createBid = async (data: BidRequestDto, user: JwtPayload) => {
    const { itemId, amount } = data;

    if(amount <= 0 || isNaN(amount)) {
        throw new BadRequestError({
            message: "Amount should be bigger than zero!"
        });
    }

    await isValidToBid(itemId);

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

    await isValidToBid(bid.itemId.toString());

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

    await isValidToBid(bid.itemId.toString());

    if(bid.highestBid) {
        throw new BadRequestError({
            message: "You cannot delete the highest bid!"
        });
    }

    checkIsAuthorized(bid.bidderId, user);

    const deletedBid = await bid.deleteOne();
    return deletedBid.deletedCount == 1;
}   

export const getAllBidsForItem = async (itemId: string) => {
    const item = await getEntityById(itemId, Item);

    const bids = await Bid.find({ itemId: item._id }).populate(["itemId", "bidderId"]).sort({ amount: -1 });
    
    return bids.map(bid => toBidResponseDto(bid));
}


const highestBidAmount = async (itemId: string) => {
    const highestBid = await Bid.findOne({ itemId }).sort({ amount: -1 });

    if(!highestBid) {
        return 0;
    }

    return highestBid.amount;
}    


const isValidToBid = async (itemId: string) => {
    const item = await getEntityById(itemId, Item);

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
}