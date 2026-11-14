import { el } from './dom.js';

export function productDialog(item, onSave) {
  const dialog = el('dialog', { 'aria-labelledby': 'dialog-title' });
  const error = el('p', { class: 'message', role: 'alert', hidden: true });
  const field = (label, attrs) => el('label', {}, label, el('input', { ...attrs, required: true }));
  const save = el('button', { type: 'submit', class: 'button button-primary' }, 'Guardar');
  const form = el('form', { class: 'product-form', onsubmit: async event => {
    event.preventDefault();
    const fields = new FormData(form);
    save.disabled = true;
    error.hidden = true;
    try {
      await onSave({
        name: String(fields.get('name')).trim(),
        price: Number(fields.get('price')),
        stock: Number(fields.get('stock')),
      });
      dialog.close();
    } catch (failure) {
      error.textContent = failure.message;
      error.hidden = false;
    } finally {
      save.disabled = false;
    }
  } },
  field('Nombre', { name: 'name', maxlength: 80, value: item?.name, autofocus: true }),
  el('div', { class: 'fields' },
    field('Precio (Bs)', { name: 'price', type: 'number', min: '0.01', max: 1000000, step: '0.01', value: item?.price }),
    field('Stock', { name: 'stock', type: 'number', min: 0, max: 100000, step: 1, value: item?.stock })),
  error,
  el('div', { class: 'dialog-actions' },
    el('button', { type: 'button', class: 'button', onclick: () => dialog.close() }, 'Cancelar'), save));

  dialog.addEventListener('close', () => dialog.remove());
  dialog.append(el('h2', { id: 'dialog-title' }, item ? 'Editar producto' : 'Nuevo producto'), form);
  document.body.append(dialog);
  dialog.showModal();
}

export function deleteDialog(item, onDelete) {
  const dialog = el('dialog', { 'aria-labelledby': 'delete-title' });
  const error = el('p', { class: 'message', role: 'alert', hidden: true });
  const confirm = el('button', { type: 'button', class: 'button button-danger', onclick: async () => {
    confirm.disabled = true;
    error.hidden = true;
    try { await onDelete(); dialog.close(); }
    catch (failure) { error.textContent = failure.message; error.hidden = false; }
    finally { confirm.disabled = false; }
  } }, 'Eliminar producto');
  dialog.append(
    el('h2', { id: 'delete-title' }, 'Eliminar producto'),
    el('p', { class: 'muted' }, `¿Quieres eliminar «${item.name}» del inventario?`),
    error,
    el('div', { class: 'dialog-actions' },
      el('button', { type: 'button', class: 'button', autofocus: true, onclick: () => dialog.close() }, 'Cancelar'),
      confirm));
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}
