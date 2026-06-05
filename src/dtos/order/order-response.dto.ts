
export interface OrderResponseDto {
    id: string;
    buyerFullName: string;
    sellerFullName: string;
    itemTitle: string;
    state: string;
    createdAt: Date | undefined;
}