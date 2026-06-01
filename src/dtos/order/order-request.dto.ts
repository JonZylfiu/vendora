
export interface OrderItemRequestDto {
    id: string;
    quantity: number;
    price: number;
}

export interface OrderRequestDto {
    item: OrderItemRequestDto;
    price: number;
}