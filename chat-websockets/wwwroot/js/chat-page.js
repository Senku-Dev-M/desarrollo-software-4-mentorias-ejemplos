import { createWebSocketChat } from './websocket-chat.js';

const name = document.querySelector('#name');
const text = document.querySelector('#text');
const connect = document.querySelector('#connect');
const disconnect = document.querySelector('#disconnect');
const send = document.querySelector('#send');
const status = document.querySelector('#status');
const feedback = document.querySelector('#feedback');
const messages = document.querySelector('#messages');

// Este frontend se conecta únicamente al backend WebSockets.
document.querySelector('#room-title').textContent = 'Sala WebSockets';
document.querySelector('#explanation').textContent = 'Enviamos JSON y el servidor lo distribuye entre las conexiones.';

// Refleja el estado de la conexión y evita enviar antes de estar conectado.
function setStatus(state) {
  const connected = state === 'connected';
  status.textContent = { connected: 'Conectado', disconnected: 'Desconectado', connecting: 'Conectando…', reconnecting: 'Reconectando…' }[state];
  status.dataset.state = state;
  connect.disabled = state !== 'disconnected';
  disconnect.disabled = state === 'disconnected' || state === 'connecting';
  send.disabled = !connected;
  text.disabled = !connected;
}

// Renderiza datos como texto: un mensaje no debe convertirse en código HTML.
function showMessage(message) {
  document.querySelector('#empty')?.remove();
  const item = document.createElement('li');
  const author = document.createElement('strong');
  const time = document.createElement('time');
  const body = document.createElement('p');
  author.textContent = message.name;
  time.dateTime = message.sentAt;
  time.textContent = new Date(message.sentAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  body.textContent = message.text; // textContent evita interpretar mensajes como HTML.
  item.append(author, time, body);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
}

const events = {
  message: showMessage,
  status: setStatus,
  error: (message) => { feedback.textContent = message; },
};
const chat = createWebSocketChat(events);

connect.addEventListener('click', async () => {
  if (!name.value.trim()) { feedback.textContent = 'Escribe tu nombre.'; return; }
  feedback.textContent = '';
  setStatus('connecting');
  try { await chat.connect(); text.focus(); }
  catch (error) { feedback.textContent = error.message; setStatus('disconnected'); }
});
disconnect.addEventListener('click', async () => {
  try { await chat.disconnect(); }
  catch (error) { feedback.textContent = error.message; }
});
document.querySelector('#message-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!text.value.trim()) return;
  send.disabled = true;
  feedback.textContent = '';
  try { await chat.send(name.value, text.value); text.value = ''; text.focus(); }
  catch (error) { feedback.textContent = error.message; }
  finally { send.disabled = status.dataset.state !== 'connected'; }
});
setStatus('disconnected');
