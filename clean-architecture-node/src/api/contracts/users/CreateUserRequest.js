export class CreateUserRequest {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    Object.freeze(this);
  }

  static from(body) {
    return new CreateUserRequest(body?.name, body?.email);
  }
}
