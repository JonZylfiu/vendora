import rateLimit from 'express-rate-limit';


export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    message: "Too many login attempts"
});

export const appLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests, please try again later."
});