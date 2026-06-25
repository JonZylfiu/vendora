import EventEmitter from "node:events";
import { sendBidAcceptedEmail, sendVerificationEmail } from "../services/email.service.js";


const emailEmitter = new EventEmitter();

// send verification email
emailEmitter.on("verification-email", async data => sendVerificationEmail(data));

// send email for bid acceptance
emailEmitter.on("bid-accepted", async data => sendBidAcceptedEmail(data));


export default emailEmitter;