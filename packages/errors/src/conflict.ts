import { AppError } from "./base-error";

export class ConflictError extends AppError {
	statusCode = 409;

	constructor(message = "Entity already exists") {
		super(message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
