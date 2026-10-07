export class UserRepository {
  async getAll() {
    throw new Error("UserRepository.getAll must be implemented.");
  }

  async getById(_id) {
    throw new Error("UserRepository.getById must be implemented.");
  }

  async getByEmail(_email) {
    throw new Error("UserRepository.getByEmail must be implemented.");
  }

  async add(_user) {
    throw new Error("UserRepository.add must be implemented.");
  }

  async update(_user) {
    throw new Error("UserRepository.update must be implemented.");
  }

  async delete(_id) {
    throw new Error("UserRepository.delete must be implemented.");
  }
}
