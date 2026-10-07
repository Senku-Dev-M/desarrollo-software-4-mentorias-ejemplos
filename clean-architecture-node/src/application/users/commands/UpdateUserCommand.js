export class UpdateUserCommand {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    Object.freeze(this);
  }
}
