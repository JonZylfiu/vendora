import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { type Request, type Response } from "express"; 
import { loginUser, registerUser, resendUserVerificationToken, verifyUserEmail } from "../services/auth.service.js";
import type LoginRequestDto from "../dtos/auth/login-request-dto.js";
import { response } from "../utils/api-response.util.js";

export const register = async (req: Request<{}, {}, UserRequestDto>, res: Response) => {
    await registerUser(req.body);

    return response(res, 201, "User created successfully!");
}

export const login = async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
    const user = await loginUser(req.body);
    
    return response(res, 200, null, user);
}

export const verifyEmail = async (req: Request<{token: string}, {}>, res: Response) => {
    await verifyUserEmail(req.params.token);
    
    return response(res, 200, "Email is verified successfully!");
}

export const resendVerificationToken = async (req: Request<{}, {}, {email: string}>, res: Response) => {
    await resendUserVerificationToken(req.body.email);

    return response(res, 200, "Email is sent successfully!");
}