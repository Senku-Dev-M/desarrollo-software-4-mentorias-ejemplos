import { User } from "../../../domain/entities/User.js";
import { UserEmailAlreadyExistsError } from "../exceptions/UserEmailAlreadyExistsError.js";
import { toUserDto } from "../mappings/userMapper.js";

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(command) {
    const user = User.create(command.name, command.email);
    const existingUser = await this.userRepository.getByEmail(user.email);

    if (existingUser !== null) {
      throw new UserEmailAlreadyExistsError(user.email.value);
    }

    await this.userRepository.add(user);
    return toUserDto(user);
  }
}
