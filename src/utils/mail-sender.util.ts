import transporter from "../config/mail-transporter.js";


export const sendMail = async (email: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: "noreply@vendora.com",
        to: email,
        subject,
        text
    });
}


