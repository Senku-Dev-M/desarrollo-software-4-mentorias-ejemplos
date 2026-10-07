import { UsersController } from "../api/controllers/UsersController.js";
import { CreateUserUseCase } from "../application/users/use-cases/CreateUserUseCase.js";
import { DeleteUserUseCase } from "../application/users/use-cases/DeleteUserUseCase.js";
import { GetAllUsersUseCase } from "../application/users/use-cases/GetAllUsersUseCase.js";
import { GetUserByIdUseCase } from "../application/users/use-cases/GetUserByIdUseCase.js";
import { UpdateUserUseCase } from "../application/users/use-cases/UpdateUserUseCase.js";

export function createContainer(userRepository) {
  const useCases = {
    createUserUseCase: new CreateUserUseCase(userRepository),
    getAllUsersUseCase: new GetAllUsersUseCase(userRepository),
    getUserByIdUseCase: new GetUserByIdUseCase(userRepository),
    updateUserUseCase: new UpdateUserUseCase(userRepository),
    deleteUserUseCase: new DeleteUserUseCase(userRepository),
  };

  return {
    userRepository,
    useCases,
    usersController: new UsersController(useCases),
  };
}
