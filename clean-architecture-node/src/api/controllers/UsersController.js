import { CreateUserCommand } from "../../application/users/commands/CreateUserCommand.js";
import { UpdateUserCommand } from "../../application/users/commands/UpdateUserCommand.js";
import { CreateUserRequest } from "../contracts/users/CreateUserRequest.js";
import { UpdateUserRequest } from "../contracts/users/UpdateUserRequest.js";

export class UsersController {
  constructor({
    createUserUseCase,
    getAllUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase,
  }) {
    this.createUserUseCase = createUserUseCase;
    this.getAllUsersUseCase = getAllUsersUseCase;
    this.getUserByIdUseCase = getUserByIdUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
  }

  getAll = async (_request, response) => {
    const users = await this.getAllUsersUseCase.execute();
    response.status(200).json(users);
  };

  getById = async (request, response) => {
    const user = await this.getUserByIdUseCase.execute(request.params.id);

    if (user === null) {
      response.sendStatus(404);
      return;
    }

    response.status(200).json(user);
  };

  create = async (request, response) => {
    const input = CreateUserRequest.from(request.body);
    const command = new CreateUserCommand(input.name, input.email);
    const user = await this.createUserUseCase.execute(command);

    response
      .location(`/api/users/${user.id}`)
      .status(201)
      .json(user);
  };

  update = async (request, response) => {
    const input = UpdateUserRequest.from(request.body);
    const command = new UpdateUserCommand(input.name, input.email);
    const user = await this.updateUserUseCase.execute(
      request.params.id,
      command,
    );

    if (user === null) {
      response.sendStatus(404);
      return;
    }

    response.status(200).json(user);
  };

  delete = async (request, response) => {
    const deleted = await this.deleteUserUseCase.execute(request.params.id);

    if (!deleted) {
      response.sendStatus(404);
      return;
    }

    response.sendStatus(204);
  };
}
