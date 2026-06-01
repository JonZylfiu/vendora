export interface OrderItemResponseDto {
    sellerFullName: string;
    itemTitle: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderResponseDto {
    id: string;

    buyerFullName: string;

    sellerFullName: string;

    itemTitle: string;

    quantity: number;

    unitPrice: number;

    totalPrice: number;

    state: string;

    createdAt: Date;
}