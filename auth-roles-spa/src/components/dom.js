export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  // Los nombres y errores de la API se insertan como texto, sin interpretar HTML.
  node.append(...children.flat().filter(child => child !== null && child !== undefined));
  return node;
}
