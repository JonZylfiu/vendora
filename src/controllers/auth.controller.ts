import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { request, type Request, type Response } from "express"; 
import { registerUser } from "../services/auth.service.js";

export const register = async (req: Request<{}, {}, UserRequestDto>, res: Response) => {
    try {
        const user = await registerUser(req.body);

        return res.status(201).json({
            data: user,
            message: "User is created successfully"
        })
    } catch (e: any) {
        console.log(e.message);
        res.status(400).send("error");
    }
}