const form = document.querySelector('#form');
const id = document.querySelector('#id');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const message = document.querySelector('#message');
const save = document.querySelector('#save');
const cancel = document.querySelector('#cancel');
const table = document.querySelector('#users');
let users = [];

// Centraliza fetch y los errores HTTP; 204 no contiene JSON que podamos interpretar.
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const detail = error?.errors ? Object.values(error.errors).flat().join(' ') : error?.title;
    throw new Error(detail || 'No se pudo completar la solicitud.');
  }
  return response.status === 204 ? null : response.json();
}

// Consulta al backend y reconstruye la tabla con textContent, no con HTML de usuarios.
async function load() {
  users = await request('/api/users');
  table.replaceChildren();
  for (const user of users) {
    const row = table.insertRow();
    for (const value of [user.id, user.name, user.email]) row.insertCell().textContent = value;
    const actions = row.insertCell();
    for (const [action, text] of [['edit', 'Editar'], ['delete', 'Eliminar']]) {
      const button = document.createElement('button');
      button.textContent = text;
      button.dataset.action = action;
      button.dataset.id = user.id;
      actions.append(button);
    }
  }
  if (!users.length) table.insertRow().insertCell().textContent = 'Aún no hay usuarios.';
}

// Vuelve al modo creación y olvida el ID que se estaba editando.
function reset() {
  form.reset();
  id.value = '';
  save.textContent = 'Crear usuario';
  cancel.hidden = true;
}

// Un mismo formulario crea con POST o actualiza con PUT según exista un ID.
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  save.disabled = true;
  try {
    await request(id.value ? `/api/users/${id.value}` : '/api/users', {
      method: id.value ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value }),
    });
    reset();
    await load();
    message.textContent = 'Usuario guardado.';
  } catch (error) { message.textContent = error.message; }
  finally { save.disabled = false; }
});

// Delegación de eventos: un listener atiende los botones de todas las filas.
table.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const user = users.find((user) => String(user.id) === button.dataset.id);
  if (button.dataset.action === 'edit') {
    id.value = user.id;
    name.value = user.name;
    email.value = user.email;
    save.textContent = 'Guardar cambios';
    cancel.hidden = false;
    name.focus();
  } else if (confirm(`¿Eliminar a ${user.name}?`)) {
    button.disabled = true;
    try {
      await request(`/api/users/${user.id}`, { method: 'DELETE' });
      if (id.value === String(user.id)) reset();
      await load();
      message.textContent = 'Usuario eliminado.';
    } catch (error) { message.textContent = error.message; button.disabled = false; }
  }
});
cancel.addEventListener('click', reset);
load().catch((error) => { message.textContent = error.message; });
