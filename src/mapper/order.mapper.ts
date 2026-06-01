import type IOrder from "../models/interfaces/IOrder.interface.js";
import type IItem from "../models/interfaces/IITem.interface.js";
import type IUser from "../models/interfaces/IUser.interface.js";


export const toOrderResponseDto = (order: IOrder) => {
    const {_id, totalPrice, state, createdAt } = order;

    const buyer = order.buyer as unknown as IUser;
    const item = order.item.id as unknown as IItem;
    const seller = item.seller as unknown as IUser;
    
    return {
        id: _id.toString(),
        buyerFullName: `${buyer.name} ${buyer.surname}`,
        sellerFullName:`${seller.name} ${seller.surname}`,
        itemTitle: item.title,
        quantity: order.item.quantity,
        unitPrice: order.item.price,
        totalPrice,
        state,
        createdAt
    };
};