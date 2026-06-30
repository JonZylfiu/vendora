import type BidResponseDto from "../dtos/bid/bid-response.dto.js";
import type IUser from "../models/interfaces/IUser.interface.js";
import User from "../models/user.model.js";
import { sendMail } from "../utils/mail-sender.util.js";
import { getEntityById } from "../utils/validate.util.js";


// bid-accepted
export const sendBidAcceptedEmailService = async (data: any) => {
    const { buyerId, itemTitle, bidAmount, sellerEmail } = data;
    const buyer: IUser = await getEntityById(buyerId, User);

    const fullname = `${buyer.name} ${buyer.surname}`; 

    const subject = "Your bid has been accepted";
    
    const text = `
        Hi ${fullname},

        Good news.

        Your offer for "${itemTitle}" has been accepted by the seller.

        Accepted amount: €${bidAmount}

        The seller will now prepare and ship your order shortly.

        If you need to contact the seller regarding shipping or delivery, you can reach them here:

        Seller email: ${sellerEmail}

        Thank you for using Vendora.

        Vendora Team
    `;

    sendMail(buyer.email, subject, text);
}


export const sendVerificationEmailService = async (data: any) => {
    const { fullname, email, verificationToken }  = data;

    const subject: string = `Welcome ${fullname}`;
    const text = `
        Hi ${fullname},

        Welcome to Vendora.

        To activate your account, verify your email here:

        http://localhost:3000/api/auth/verify-email/${verificationToken}

        This link expires in 15 minutes.

        Vendora Team
    `;


    sendMail(email, subject, text);
}