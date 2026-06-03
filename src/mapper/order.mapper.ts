import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import type IUser from "../models/interfaces/IUser.interface.js";


export const toOrderResponseDto = (order: IOrder) => {
    const {_id, price, state, createdAt } = order;

    const buyer = order.buyer as unknown as IUser;
    const seller = order.seller as unknown as IUser;
    const item = order.item as unknown as IItem;
    
    return {
        id: _id.toString(),
        buyerFullName: `${buyer.name} ${buyer.surname}`,
        sellerFullName:`${seller.name} ${seller.surname}`,
        itemTitle: item.title,
        price,
        state,
        createdAt
    };
};