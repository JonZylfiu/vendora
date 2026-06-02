
export default interface BidResponseDto {
    id: string;
    bidderFullName: string;
    bidderPhone: string;
    item: {
        id: string;
        title: string;
    };
    bidAmount: number;
    createdAt: Date;
}   