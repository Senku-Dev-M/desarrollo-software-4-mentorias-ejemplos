import express from "express";
import { errorHandler } from "./api/middleware/errorHandler.js";
import { createUsersRouter } from "./api/routes/createUsersRouter.js";
import { createContainer } from "./config/createContainer.js";
import { InMemoryUserRepository } from "./infrastructure/persistence/InMemoryUserRepository.js";

export function createApp({
  userRepository = new InMemoryUserRepository(),
} = {}) {
  const app = express();
  const container = createContainer(userRepository);

  app.use(express.json());
  app.use("/api/users", createUsersRouter(container.usersController));
  app.use((_request, response) => response.sendStatus(404));
  app.use(errorHandler);

  return app;
}
