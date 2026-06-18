import EventEmitter from "node:events";
import { sendMail } from "../utils/mail-sender.util.js";


const emailEmitter = new EventEmitter();


emailEmitter.on("verification-email", async (fullname: string, email: string, verificationToken: string) => {
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
});


export default emailEmitter;