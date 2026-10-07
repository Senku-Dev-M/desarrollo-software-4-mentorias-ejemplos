import { UserRepository } from "../../application/abstractions/persistence/UserRepository.js";

export class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
  }

  async getAll() {
    return [...this.users.values()].sort(
      (first, second) => first.createdAtUtc - second.createdAtUtc,
    );
  }

  async getById(id) {
    return this.users.get(id) ?? null;
  }

  async getByEmail(email) {
    return (
      [...this.users.values()].find(
        (user) => user.email.value === email.value,
      ) ?? null
    );
  }

  async add(user) {
    this.users.set(user.id, user);
  }

  async update(user) {
    this.users.set(user.id, user);
  }

  async delete(id) {
    this.users.delete(id);
  }
}
