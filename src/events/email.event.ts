import EventEmitter from "node:events";
import { sendBidAcceptedEmailService, sendVerificationEmailService } from "../services/email.service.js";


const emailEmitter = new EventEmitter();

// send verification email
emailEmitter.on("verification-email", async data => sendVerificationEmailService(data));

// send email for bid acceptance
emailEmitter.on("bid-accepted", async data => sendBidAcceptedEmailService(data));


export default emailEmitter;