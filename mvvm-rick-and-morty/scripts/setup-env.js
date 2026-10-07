import { copyFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const source = new URL("../.env.example", import.meta.url);
const target = new URL("../.env", import.meta.url);

try {
  await access(target, constants.F_OK);
  console.log(".env already exists; no changes were made.");
} catch {
  await copyFile(source, target);
  console.log(".env created from .env.example.");
}
