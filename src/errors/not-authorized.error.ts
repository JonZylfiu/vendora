import { CustomError } from "./custom.error.js";


export default class NotAuthorizedError extends CustomError {
    private static readonly _statusCode = 403;
    private readonly _code: number;

    constructor(params?: {message?: string, code?: number}) {
        const { message, code } = params || {};

        super(message || "You're not authorized!");

        this._code = code || NotAuthorizedError._statusCode; 

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    get statusCode() {
        return this._code;
    }
}