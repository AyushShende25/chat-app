import { AppError } from "./base-error";

export class BadRequestError extends AppError {
	statusCode = 400;

	constructor(message = "Bad Request") {
		super(message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
