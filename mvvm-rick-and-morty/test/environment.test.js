import assert from "node:assert/strict";
import test from "node:test";
import { loadEnvironment } from "../src/config/environment.js";

test("Environment returns a normalized and immutable configuration", () => {
  const environment = loadEnvironment({
    VITE_API_BASE_URL: " https://example.com/api/ ",
  });

  assert.equal(environment.apiBaseUrl, "https://example.com/api");
  assert.equal(Object.isFrozen(environment), true);
});

test("Environment requires the API base URL", () => {
  assert.throws(
    () => loadEnvironment({}),
    /VITE_API_BASE_URL is required/,
  );
});

test("Environment only accepts HTTP or HTTPS URLs", () => {
  assert.throws(
    () => loadEnvironment({ VITE_API_BASE_URL: "ftp://example.com/api" }),
    /must use HTTP or HTTPS/,
  );
});
