import type OrderStatesEnum from "../../enums/order-states.enum.js";


export interface OrderItemRequestDto {
    item: string;
    quantity: number;
    price: number;
}

export default interface OrderRequestDto {
    items: OrderItemRequestDto[];
    totalPrice: number;
    state: OrderStatesEnum;
}