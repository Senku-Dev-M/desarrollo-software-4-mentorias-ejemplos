const form = document.querySelector('#form');
const message = document.querySelector('#message');
const result = document.querySelector('#result');
const upload = document.querySelector('#upload');
const url = document.querySelector('#url');

// FormData incluye el archivo; el navegador genera el Content-Type con su boundary.
// No enviamos la clave Supabase: solo nuestro backend conoce esa credencial.
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  upload.disabled = true;
  result.hidden = true;
  message.textContent = 'Subiendo imagen…';
  try {
    const response = await fetch('/api/images', { method: 'POST', body: new FormData(form) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || data.title || 'No se pudo subir la imagen.');
    url.value = data.url;
    document.querySelector('#preview').src = data.url;
    document.querySelector('#open').href = data.url;
    result.hidden = false;
    message.textContent = 'Imagen guardada en Storage.';
  } catch (error) { message.textContent = error.message; }
  finally { upload.disabled = false; }
});

// Copia la URL; si el permiso del portapapeles falla, permite copiar manualmente.
document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(url.value);
    message.textContent = 'URL copiada.';
  } catch {
    url.select();
    message.textContent = 'Selecciona y copia la URL con Ctrl+C.';
  }
});
