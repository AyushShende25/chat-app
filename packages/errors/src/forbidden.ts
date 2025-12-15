import { AppError } from "./base-error";

export class ForbiddenError extends AppError {
	statusCode = 403;

	constructor(message = "Forbidden") {
		super(message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
