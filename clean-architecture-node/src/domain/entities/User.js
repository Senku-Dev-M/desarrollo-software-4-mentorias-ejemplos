import { randomUUID } from "node:crypto";
import { DomainValidationError } from "../errors/DomainValidationError.js";
import { Email } from "../value-objects/Email.js";
import { UserName } from "../value-objects/UserName.js";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

export class User {
  constructor({ id, name, email, createdAtUtc }) {
    if (typeof id !== "string" || id.length === 0 || id === EMPTY_UUID) {
      throw new DomainValidationError("User id cannot be empty.");
    }

    if (!(name instanceof UserName)) {
      throw new DomainValidationError("User name is required.");
    }

    if (!(email instanceof Email)) {
      throw new DomainValidationError("User email is required.");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAtUtc = createdAtUtc;
  }

  static create(name, email) {
    return new User({
      id: randomUUID(),
      name: UserName.create(name),
      email: Email.create(email),
      createdAtUtc: new Date(),
    });
  }

  update(name, email) {
    if (!(name instanceof UserName) || !(email instanceof Email)) {
      throw new DomainValidationError("Name and email are required.");
    }

    this.name = name;
    this.email = email;
  }
}
