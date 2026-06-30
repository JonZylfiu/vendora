import { type Request, type Response } from "express";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { getUserByIdService, updateUserService, deleteUserService, getAllUsersService } from "../services/user.service.js";
import { response } from "../utils/api-response.util.js";


export const getUserByIdController = async (req: Request<{id: string}>, res: Response) => {
    const user = await getUserByIdService(req.params.id);

    return response(res, 200, null, user);
}

export const updateUserController = async (req: Request<{id: string}, {}, UserRequestDto>, res: Response) => {
    const user = await updateUserService(req.params.id, req.body, req.user);

    return response(res, 200, "User is updated successfully", user);
}

export const deleteUserController = async (req: Request<{id: string}>, res: Response) => {
    await deleteUserService(req.params.id, req.user);

    return response(res, 200, "User is deleted successfully", null);
}

export const getAllUsersController = async (req: Request, res: Response) => {
    const users = await getAllUsersService(req.user);

    return response(res, 200, null, users);
}
