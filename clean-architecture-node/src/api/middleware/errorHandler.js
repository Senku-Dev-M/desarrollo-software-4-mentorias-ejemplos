import { UserEmailAlreadyExistsError } from "../../application/users/exceptions/UserEmailAlreadyExistsError.js";
import { DomainValidationError } from "../../domain/errors/DomainValidationError.js";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof DomainValidationError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof UserEmailAlreadyExistsError) {
    response.status(409).json({ error: error.message });
    return;
  }

  if (error instanceof SyntaxError && error.status === 400) {
    response.status(400).json({ error: "Request body contains invalid JSON." });
    return;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  response.status(500).json({ error: "Internal server error." });
}
