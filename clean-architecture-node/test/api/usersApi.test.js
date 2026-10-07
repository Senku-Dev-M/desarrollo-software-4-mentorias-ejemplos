import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../../src/app.js";

async function withServer(run) {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();

  try {
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("API supports the complete user lifecycle", async () => {
  await withServer(async (baseUrl) => {
    const createResponse = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ana Torres", email: "ANA@example.com" }),
    });
    const created = await createResponse.json();

    assert.equal(createResponse.status, 201);
    assert.equal(createResponse.headers.get("location"), `/api/users/${created.id}`);
    assert.equal(created.email, "ana@example.com");

    const getResponse = await fetch(`${baseUrl}/api/users/${created.id}`);
    assert.equal(getResponse.status, 200);
    assert.deepEqual(await getResponse.json(), created);

    const updateResponse = await fetch(`${baseUrl}/api/users/${created.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Ana Torres Vargas",
        email: "ana.torres@example.com",
      }),
    });
    const updated = await updateResponse.json();
    assert.equal(updateResponse.status, 200);
    assert.equal(updated.name, "Ana Torres Vargas");

    const listResponse = await fetch(`${baseUrl}/api/users`);
    assert.equal(listResponse.status, 200);
    assert.equal((await listResponse.json()).length, 1);

    const deleteResponse = await fetch(`${baseUrl}/api/users/${created.id}`, {
      method: "DELETE",
    });
    assert.equal(deleteResponse.status, 204);

    const missingResponse = await fetch(`${baseUrl}/api/users/${created.id}`);
    assert.equal(missingResponse.status, 404);
  });
});

test("API maps validation and duplicate-email errors", async () => {
  await withServer(async (baseUrl) => {
    const invalidResponse = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "", email: "invalid" }),
    });
    assert.equal(invalidResponse.status, 400);
    assert.deepEqual(await invalidResponse.json(), { error: "Name is required." });

    const body = JSON.stringify({ name: "Ana", email: "ana@example.com" });
    await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
    const duplicateResponse = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

    assert.equal(duplicateResponse.status, 409);
    assert.deepEqual(await duplicateResponse.json(), {
      error: "A user with email 'ana@example.com' already exists.",
    });
  });
});
