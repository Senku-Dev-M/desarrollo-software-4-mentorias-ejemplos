export function renderPagination({ page, totalPages, isLoading }) {
  return `
    <nav class="pagination" aria-label="Paginación de personajes">
      <button class="pagination-button" type="button" data-action="previous" ${page <= 1 || isLoading ? "disabled" : ""}>
        <span aria-hidden="true">←</span> Anterior
      </button>
      <p><small>PÁGINA</small><strong>${totalPages ? page : 0}</strong><span>/</span>${totalPages}</p>
      <button class="pagination-button" type="button" data-action="next" ${page >= totalPages || isLoading ? "disabled" : ""}>
        Siguiente <span aria-hidden="true">→</span>
      </button>
    </nav>
  `;
}
