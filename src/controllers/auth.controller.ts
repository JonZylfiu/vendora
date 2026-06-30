import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { type Request, type Response } from "express"; 
import { changeUserPasswordService, loginUserService, registerUserService, resendUserVerificationTokenService, verifyUserEmailService } from "../services/auth.service.js";
import type LoginRequestDto from "../dtos/auth/login-request-dto.js";
import { response } from "../utils/api-response.util.js";
import type ChangePasswordRequest from "../dtos/auth/change-password-request.dto.js";

export const registerAuthController = async (req: Request<{}, {}, UserRequestDto>, res: Response) => {
    await registerUserService(req.body);

    return response(res, 201, "User created successfully!");
}

export const loginAuthController = async (req: Request<{}, {}, LoginRequestDto>, res: Response) => {
    const user = await loginUserService(req.body);
    
    return response(res, 200, null, user);
}

export const changePasswordAuthController = async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
    await changeUserPasswordService(req.body, req.user);

    return response(res, 200, "Password is updated successfully!");
}

export const verifyEmailAuthController = async (req: Request<{token: string}, {}>, res: Response) => {
    await verifyUserEmailService(req.params.token);
    
    return response(res, 200, "Email is verified successfully!");
}

export const resendVerificationTokenAuthController = async (req: Request<{}, {}, {email: string}>, res: Response) => {
    await resendUserVerificationTokenService(req.body.email);

    return response(res, 200, "Email is sent successfully!");
}