export class UserEmailAlreadyExistsError extends Error {
  constructor(email) {
    super(`A user with email '${email}' already exists.`);
    this.name = "UserEmailAlreadyExistsError";
  }
}
