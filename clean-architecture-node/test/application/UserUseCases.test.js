import assert from "node:assert/strict";
import test from "node:test";
import { CreateUserCommand } from "../../src/application/users/commands/CreateUserCommand.js";
import { UpdateUserCommand } from "../../src/application/users/commands/UpdateUserCommand.js";
import { UserEmailAlreadyExistsError } from "../../src/application/users/exceptions/UserEmailAlreadyExistsError.js";
import { CreateUserUseCase } from "../../src/application/users/use-cases/CreateUserUseCase.js";
import { UpdateUserUseCase } from "../../src/application/users/use-cases/UpdateUserUseCase.js";
import { InMemoryUserRepository } from "../../src/infrastructure/persistence/InMemoryUserRepository.js";

test("CreateUserUseCase prevents duplicate normalized emails", async () => {
  const repository = new InMemoryUserRepository();
  const useCase = new CreateUserUseCase(repository);

  await useCase.execute(new CreateUserCommand("Ana", "ANA@example.com"));

  await assert.rejects(
    useCase.execute(new CreateUserCommand("Another Ana", "ana@EXAMPLE.com")),
    UserEmailAlreadyExistsError,
  );
});

test("UpdateUserUseCase keeps the id and creation date", async () => {
  const repository = new InMemoryUserRepository();
  const createUser = new CreateUserUseCase(repository);
  const updateUser = new UpdateUserUseCase(repository);
  const created = await createUser.execute(
    new CreateUserCommand("Ana", "ana@example.com"),
  );

  const updated = await updateUser.execute(
    created.id,
    new UpdateUserCommand("Ana Torres", "torres@example.com"),
  );

  assert.equal(updated.id, created.id);
  assert.equal(updated.createdAtUtc, created.createdAtUtc);
  assert.equal(updated.name, "Ana Torres");
  assert.equal(updated.email, "torres@example.com");
});
