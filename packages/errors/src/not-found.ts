import { AppError } from "./base-error";

export class NotFoundError extends AppError {
	statusCode = 404;

	constructor(message = "Entity Not Found") {
		super(message);
	}

	serialize() {
		return [{ message: this.message }];
	}
}
