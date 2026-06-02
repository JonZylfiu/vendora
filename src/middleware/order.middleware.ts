import OrderStatesEnum from "../enums/order-states.enum.js";
import type { NextFunction, Request, Response } from "express";

export const validateState = (req: Request, res: Response, next: NextFunction) => {
    const { state } = req.body;

    if(!Object.values(OrderStatesEnum).includes(state)) {
        return res.status(400).json({
            message: `Invalid order status: ${state}`
        });
    }

    next();
}