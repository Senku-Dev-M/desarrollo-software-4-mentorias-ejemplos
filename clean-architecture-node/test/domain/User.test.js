import assert from "node:assert/strict";
import test from "node:test";
import { User } from "../../src/domain/entities/User.js";
import { DomainValidationError } from "../../src/domain/errors/DomainValidationError.js";
import { Email } from "../../src/domain/value-objects/Email.js";
import { UserName } from "../../src/domain/value-objects/UserName.js";

test("User creates a normalized user", () => {
  const user = User.create("  Ana Torres  ", "  ANA@EXAMPLE.COM  ");

  assert.match(user.id, /^[0-9a-f-]{36}$/);
  assert.equal(user.name.value, "Ana Torres");
  assert.equal(user.email.value, "ana@example.com");
  assert.ok(user.createdAtUtc instanceof Date);
});

test("UserName rejects empty and overly long names", () => {
  assert.throws(() => UserName.create("   "), DomainValidationError);
  assert.throws(() => UserName.create("a".repeat(101)), DomainValidationError);
});

test("Email rejects an invalid format", () => {
  assert.throws(() => Email.create("not-an-email"), DomainValidationError);
});
