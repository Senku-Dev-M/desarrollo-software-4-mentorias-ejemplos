const STATUS_LABELS = {
  Alive: "Vivo",
  Dead: "Muerto",
  unknown: "Desconocido",
};

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function getStatusKey(status) {
  return String(status).toLowerCase();
}
