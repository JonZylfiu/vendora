import { type Request, type Response } from "express";
import type UserRequestDto from "../dtos/user/user-request.dto.js";
import { getUserById, updateUser, deleteUser, getAllUsers } from "../services/user.service.js";
import { response } from "../utils/api-response.util.js";


export const getById = async (req: Request<{id: string}>, res: Response) => {
    const user = await getUserById(req.params.id);

    return response(res, 200, null, user);
}

export const update = async (req: Request<{id: string}, {}, UserRequestDto>, res: Response) => {
    const user = await updateUser(req.params.id, req.body, req.user);

    return response(res, 200, "User is updated successfully", user);
}

export const deleteUserAccount = async (req: Request<{id: string}>, res: Response) => {
    await deleteUser(req.params.id, req.user);

    return response(res, 200, "User is deleted successfully", null);
}

export const getAll = async (req: Request, res: Response) => {
    const users = await getAllUsers(req.user);

    return response(res, 200, null, users);
}
