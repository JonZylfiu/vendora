import { CustomError } from "./custom.error.js";


class NotFoundError extends CustomError {
    private static readonly _statusCode = 404;
    private readonly _code: number;

    constructor(params?: {code?: number, message?: string }) {
        const { code, message} = params || {};

        super(message || "Not found!");

        this._code = code || NotFoundError._statusCode;

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    get statusCode() {
        return this._code;
    }
}

export default NotFoundError;