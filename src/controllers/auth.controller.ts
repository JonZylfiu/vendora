import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { request, type Request, type Response } from "express"; 
import { loginUser, registerUser } from "../services/auth.service.js";
import type LoginRequestDto from "../dtos/auth/login-request-dto.js";

export const register = async (req: Request<{}, {}, UserRequestDto>, res: Response) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            data: user,
            message: "User is created successfully"
        })

    } catch (e: any) {
        res.status(400).json({
            data: null,
            message: e.message
        });
    }
}


export const login = async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
    try {
        const user = await loginUser(req.body);
        
        return res.status(200).json({
            data: user,
        })

    } catch(e: any) {
        res.status(400).json({
            data: null,
            message: e.message
        });
    }
}