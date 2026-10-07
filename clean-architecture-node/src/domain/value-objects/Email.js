import { DomainValidationError } from "../errors/DomainValidationError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  constructor(value) {
    this.value = value;
    Object.freeze(this);
  }

  static create(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new DomainValidationError("Email is required.");
    }

    const normalizedEmail = value.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw new DomainValidationError("Email format is invalid.");
    }

    return new Email(normalizedEmail);
  }

  toString() {
    return this.value;
  }
}
