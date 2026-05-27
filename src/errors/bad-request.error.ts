import { CustomError } from "./custom.error.js";

export default class BadRequestError extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;

    constructor(params?: {code?: number, message?: string }) {
        const { code, message} = params || {};

        super(message || "Bad request");

        this._code = code || BadRequestError._statusCode;
    }

    get statusCode() {
        return this._code;
    }
}