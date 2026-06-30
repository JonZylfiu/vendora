import type BidRequestDto from "../dtos/bid/bid-request.dto.js";
import { checkIsAuthorized, getEntityById } from "../utils/validate.util.js";
import Item from "../models/item.model.js";
import Bid from "../models/bid.model.js";
import BadRequestError from "../errors/bad-request.error.js";
import { toBidResponseDto } from "../mapper/bid.mapper.js";
import ItemStatesEnum from "../enums/item-states.enum.js";
import type IBid from "../models/interfaces/IBid.interface.js";
import { getOrderByItemIdService } from "./order.service.js";
import notificationEmitter from "../events/notification.event.js";
import type UserJwtPayload from "../types/jwt-payload.type.js";
import redisClient from "../config/redis.config.js";

export const createBidService = async (data: BidRequestDto, user: UserJwtPayload) => {
    const { itemId, amount } = data;

    if(amount <= 0 || isNaN(amount)) {
        throw new BadRequestError({
            message: "Amount should be bigger than zero!"
        });
    }

    await isValidToBid(itemId, amount, user);

    const highestBid = await getHighestBidByItemIdService(itemId);
    const highestBidderId = highestBid?.bidderId.toString();

    if(!!highestBidderId) {
        notificationEmitter.emit("higher-bid", highestBidderId, itemId, amount);
    }

    await Bid.updateMany(
        {
            itemId,
            highestBid: true
        },
        {
            highestBid: false
        }
    );

    const bid = await Bid.create({
        itemId,
        bidderId: user.id,
        amount,
        highestBid: true
    });

    const populatedBid = await bid.populate(["itemId", "bidderId"]);

    const res = toBidResponseDto(populatedBid);

    // save to cache    
    await redisClient.lPush(`item:${itemId}:bids`, JSON.stringify(res));

    return res;
}

export const updateBidService = async (bidId: string, data: BidRequestDto, user: UserJwtPayload) => {
    const { amount } = data
    
    if(amount <= 0 || isNaN(amount)) {
        throw new BadRequestError({
            message: "Amount should be bigger than zero!"
        });
    }

    const bid = await getEntityById(bidId, Bid);

    checkIsAuthorized(bid.bidderId.toString(), user);

    await isValidToBid(bid.itemId.toString(), amount, user);

    await Bid.updateMany(
        {
            itemId: bid.itemId,
            highestBid: true
        },
        {
            highestBid: false
        }
    );

    bid.amount = amount;
    bid.highestBid = true;
    await bid.save();

    const populatedBid = await bid.populate(["itemId", "bidderId"]);

    return toBidResponseDto(populatedBid);
}

export const deleteBidService = async (bidId: string, user: UserJwtPayload) => {
    const bid = await getEntityById(bidId, Bid);

    if(bid.highestBid) {
        throw new BadRequestError({
            message: "You cannot delete the highest bid!"
        });
    }

    checkIsAuthorized(bid.bidderId.toString(), user);

    const deletedBid = await bid.deleteOne();
    return deletedBid.deletedCount == 1;
}   

export const getAllBidsByItemIdService = async (itemId: string) => {
    const item = await getEntityById(itemId, Item);

    const bids = await Bid.find({ itemId: item._id }).populate(["itemId", "bidderId"]).sort({ amount: -1 });
    
    return bids.map(bid => toBidResponseDto(bid));
}

export const getBidByIdService = async (bidId: string) => {
    const bid = await getEntityById(bidId, Bid);
    
    const populatedBid = await bid.populate(["itemId", "bidderId"]);
    
    return toBidResponseDto(populatedBid);
}

export const getHighestBidByItemIdService = async (itemId: string): Promise<IBid | null> => {
    const highestBid = await Bid.findOne({ itemId }).sort({ amount: -1 });

    if(!highestBid) {
        return null;
    }

    return highestBid;
}

const highestBidAmount = async (itemId: string) => {
    const highestBid  = await getHighestBidByItemIdService(itemId);

    const highestAmount = highestBid?.amount || 0;

    return highestAmount;
}    

const isValidToBid = async (itemId: string, amount: number, user: UserJwtPayload) => {
    const item = await getEntityById(itemId, Item);
    const highestAmount = await highestBidAmount(itemId);
    const order = await getOrderByItemIdService(itemId);
    

    if(order) {
        throw new BadRequestError({
            message: "Item is already sold!"
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
