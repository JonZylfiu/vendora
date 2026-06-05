import { type Request, type Response } from "express";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { getUserById, updateUser, deleteUser, getAllUsers } from "../services/user.service.js";
import { response } from "../utils/api-response.util.js";


export const getById = async (req: Request<{id: string}>, res: Response) => {
    const user = await getUserById(req.params.id);

    return response(user, null, 200, res);
}

export const update = async (req: Request<{id: string}, {}, UserRequestDto>, res: Response) => {
    const user = await updateUser(req.params.id, req.body, req.user);

    return response(user, "User is updated successfully", 200, res);
}

export const deleteUserAccount = async (req: Request<{id: string}>, res: Response) => {
    await deleteUser(req.params.id, req.user);

    return response(null, "User is deleted successfully", 200, res);
}

export const getAll = async (req: Request, res: Response) => {
    const users = await getAllUsers(req.user);

    return response(users, null, 200, res);
}
