import { UserRepository } from "../../application/abstractions/persistence/UserRepository.js";

export class SqlUserRepository extends UserRepository {
  async getAll() {
    throw new Error("SQL persistence is not implemented in this example.");
  }

  async getById(_id) {
    throw new Error("SQL persistence is not implemented in this example.");
  }

  async getByEmail(_email) {
    throw new Error("SQL persistence is not implemented in this example.");
  }

  async add(_user) {
    throw new Error("SQL persistence is not implemented in this example.");
  }

  async update(_user) {
    throw new Error("SQL persistence is not implemented in this example.");
  }

  async delete(_id) {
    throw new Error("SQL persistence is not implemented in this example.");
  }
}
