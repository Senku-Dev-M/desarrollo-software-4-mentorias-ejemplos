const form = document.querySelector("#user-form");
const formTitle = document.querySelector("#form-title");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const message = document.querySelector("#form-message");
const list = document.querySelector("#user-list");
const count = document.querySelector("#user-count");
const status = document.querySelector("#cloud-status");

let users = [];

// Escapa datos antes de insertarlos en una plantilla HTML para evitar inyectar etiquetas.
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Crea el avatar textual que se muestra cuando el usuario no tiene fotografía.
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Solo dibuja el estado local; todas las lecturas y escrituras pasan por el backend.
function renderUsers() {
  count.textContent = `${users.length} ${users.length === 1 ? "registro" : "registros"}`;

  if (users.length === 0) {
    list.replaceChildren(document.querySelector("#empty-template").content.cloneNode(true));
    return;
  }

  list.innerHTML = users
    .map(
      (user) => `
        <article class="user-card">
          <div class="avatar">
            ${
              user.avatarUrl
                ? `<img src="${escapeHtml(user.avatarUrl)}" alt="Fotografía de ${escapeHtml(user.name)}" />`
                : `<span>${escapeHtml(initials(user.name))}</span>`
            }
          </div>
          <div class="user-data">
            <h3>${escapeHtml(user.name)}</h3>
            <p>${escapeHtml(user.email)}</p>
          </div>
          <div class="card-actions">
            <button type="button" data-action="edit" data-id="${user.id}">Editar</button>
            <button type="button" data-action="delete" data-id="${user.id}">Eliminar</button>
          </div>
        </article>
      `,
    )
    .join("");
}

// Interpreta JSON y errores del backend; una respuesta 204 no tiene cuerpo.
async function request(url, options) {
  const response = await fetch(url, options);
  if (response.ok) return response.status === 204 ? null : response.json();

  const problem = await response.json().catch(() => null);
  throw new Error(problem?.title ?? "La solicitud no pudo completarse.");
}

// Recarga la lista y sus URLs firmadas desde la nube mediante nuestra API.
async function loadUsers() {
  list.innerHTML = '<p class="loading">Consultando Supabase…</p>';
  users = await request("/api/users");
  renderUsers();
}

// Sale del modo edición y limpia también el archivo seleccionado.
function resetForm() {
  form.reset();
  document.querySelector("#user-id").value = "";
  formTitle.textContent = "Nuevo usuario";
  saveButton.textContent = "Crear usuario";
  cancelButton.hidden = true;
  message.textContent = "";
}

// Envía texto y avatar con FormData; sin avatar el servicio conserva la foto anterior.
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  message.textContent = "Guardando en Supabase…";

  const id = document.querySelector("#user-id").value;
  const data = new FormData(form);
  if (!document.querySelector("#avatar").files.length) data.delete("avatar");

  try {
    await request(id ? `/api/users/${id}` : "/api/users", {
      method: id ? "PUT" : "POST",
      body: data,
    });
    resetForm();
    await loadUsers();
  } catch (error) {
    message.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
});

// Delega editar/eliminar desde la lista; antes de borrar pide confirmación al usuario.
list.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const user = users.find((item) => item.id === button.dataset.id);
  if (!user) return;

  if (button.dataset.action === "edit") {
    document.querySelector("#avatar").value = "";
    document.querySelector("#user-id").value = user.id;
    document.querySelector("#name").value = user.name;
    document.querySelector("#email").value = user.email;
    formTitle.textContent = "Editar usuario";
    saveButton.textContent = "Guardar cambios";
    cancelButton.hidden = false;
    message.textContent = "La fotografía solo cambia si eliges un archivo nuevo.";
    form.scrollIntoView({ behavior: "smooth" });
  }

  if (button.dataset.action === "delete") {
    const confirmed = window.confirm(`¿Eliminar a ${user.name} y su fotografía?`);
    if (!confirmed) return;

    button.disabled = true;
    try {
      await request(`/api/users/${user.id}`, { method: "DELETE" });
      await loadUsers();
    } catch (error) {
      message.textContent = error.message;
      button.disabled = false;
    }
  }
});

cancelButton.addEventListener("click", resetForm);

// Verifica la conexión real a Supabase antes de cargar los usuarios.
async function initialize() {
  try {
    await request("/api/health");
    status.textContent = "Supabase conectado";
    status.classList.add("is-online");
    await loadUsers();
  } catch (error) {
    status.textContent = "Sin conexión";
    message.textContent = error.message;
    list.innerHTML = '<p class="loading">Revisa la configuración del backend.</p>';
  }
}

initialize();
