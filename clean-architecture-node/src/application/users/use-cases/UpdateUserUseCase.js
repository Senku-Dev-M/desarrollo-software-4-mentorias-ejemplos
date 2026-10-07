import { Email } from "../../../domain/value-objects/Email.js";
import { UserName } from "../../../domain/value-objects/UserName.js";
import { UserEmailAlreadyExistsError } from "../exceptions/UserEmailAlreadyExistsError.js";
import { toUserDto } from "../mappings/userMapper.js";

export class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id, command) {
    const user = await this.userRepository.getById(id);

    if (user === null) {
      return null;
    }

    const name = UserName.create(command.name);
    const email = Email.create(command.email);
    const userWithSameEmail = await this.userRepository.getByEmail(email);

    if (userWithSameEmail !== null && userWithSameEmail.id !== id) {
      throw new UserEmailAlreadyExistsError(email.value);
    }

    user.update(name, email);
    await this.userRepository.update(user);

    return toUserDto(user);
  }
}
