import { CustomError } from "./custom.error.js";


export default class ConflictError extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;

    constructor(params?: {message?: string, code?: number}) {
        const { message, code } = params || {};

        super(message || "Already exists!");

        this._code = code || ConflictError._statusCode; 

        Object.setPrototypeOf(this, ConflictError.prototype);
    }

    get statusCode() {
        return this._code;
    }
}