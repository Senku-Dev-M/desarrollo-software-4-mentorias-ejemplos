export class UpdateUserRequest {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    Object.freeze(this);
  }

  static from(body) {
    return new UpdateUserRequest(body?.name, body?.email);
  }
}
