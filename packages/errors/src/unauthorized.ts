import { AppError } from "./base-error";

export class UnauthorizedError extends AppError {
	statusCode = 401;

	constructor(message = "Unauthorized") {
		super(message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
