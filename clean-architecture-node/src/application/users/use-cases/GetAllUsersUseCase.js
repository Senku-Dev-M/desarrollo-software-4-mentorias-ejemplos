import { toUserDto } from "../mappings/userMapper.js";

export class GetAllUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    const users = await this.userRepository.getAll();
    return users.map(toUserDto);
  }
}
