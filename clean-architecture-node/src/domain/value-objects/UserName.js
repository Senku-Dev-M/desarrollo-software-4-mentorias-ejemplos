import { DomainValidationError } from "../errors/DomainValidationError.js";

export class UserName {
  constructor(value) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new DomainValidationError("Name is required.");
    }

    const normalizedName = value.trim();

    if (normalizedName.length > 100) {
      throw new DomainValidationError(
        "Name cannot contain more than 100 characters.",
      );
    }

    return new UserName(normalizedName);
  }

  toString() {
    return this.value;
  }
}
