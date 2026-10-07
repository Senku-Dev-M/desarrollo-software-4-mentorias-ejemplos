export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.getById(id);

    if (user === null) {
      return false;
    }

    await this.userRepository.delete(id);
    return true;
  }
}
