import { Router } from "express";

export function createUsersRouter(usersController) {
  const router = Router();

  router.get("/", usersController.getAll);
  router.get("/:id", usersController.getById);
  router.post("/", usersController.create);
  router.put("/:id", usersController.update);
  router.delete("/:id", usersController.delete);

  return router;
}
