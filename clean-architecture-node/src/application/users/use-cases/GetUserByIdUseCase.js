import { toUserDto } from "../mappings/userMapper.js";

export class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    const user = await this.userRepository.getById(id);
    return user === null ? null : toUserDto(user);
  }
}
