import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { type Request, type Response } from "express"; 
import { loginUser, registerUser } from "../services/auth.service.js";
import type LoginRequestDto from "../dtos/auth/login-request-dto.js";
import { response } from "../utils/api-response.util.js";

export const register = async (req: Request<{}, {}, UserRequestDto>, res: Response) => {
    const user = await registerUser(req.body);

    return response(res, 201, "User created successfully!", user);
}

export const login = async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
    const user = await loginUser(req.body);
    
    return response(res, 200, null, user);
}