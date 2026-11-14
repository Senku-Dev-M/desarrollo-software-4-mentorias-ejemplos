const paths = {
  logo: 'M3 20V4h15v16 M8 20V8l10-4 M13 14h1 M2 20h20',
  chart: 'M3 3v17h18 M8 15v-4 M13 15V7 M18 15V4',
  box: 'm3 7 9-4 9 4-9 4-9-4v10l9 4 9-4V7 M12 11v10 M7.5 5l9 4',
  bag: 'M5 8h14l2 12H3L5 8Z M8 9V7a4 4 0 0 1 8 0v2',
  grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  exit: 'M10 4H4v16h6 M8 12h12 M16 8l4 4-4 4',
  arrow: 'M4 12h15 M13 6l6 6-6 6',
  lock: 'M6 10h12v10H6z M8 10V7a4 4 0 1 1 8 0v3',
  plus: 'M12 5v14 M5 12h14',
};

export function icon(name, size = 20) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  for (const [key, value] of Object.entries({
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
    'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
  })) svg.setAttribute(key, value);
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', paths[name]);
  svg.append(path);
  return svg;
}
