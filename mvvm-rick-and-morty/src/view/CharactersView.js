import { renderCharactersPage } from "./pages/CharactersPage.js";

export class CharactersView {
  constructor(root) {
    this.root = root;
    this.actions = {};
    this.root.addEventListener("submit", (event) => this.handleSubmit(event));
    this.root.addEventListener("click", (event) => this.handleClick(event));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.actions.onClose?.();
    });
  }

  connect(actions) {
    this.actions = actions;
  }

  handleSubmit(event) {
    if (!event.target.matches("[data-search-form]")) return;
    event.preventDefault();
    const formData = new FormData(event.target);
    this.actions.onSearch?.({
      name: formData.get("name"),
      status: formData.get("status"),
    });
  }

  handleClick(event) {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;

    const handlers = {
      previous: () => this.actions.onPrevious?.(),
      next: () => this.actions.onNext?.(),
      retry: () => this.actions.onRetry?.(),
      reset: () => this.actions.onReset?.(),
      close: () => this.actions.onClose?.(),
      select: () => this.actions.onSelect?.(Number(trigger.dataset.id)),
    };

    handlers[trigger.dataset.action]?.();
  }

  render(state) {
    this.root.innerHTML = renderCharactersPage(state);
    document.body.classList.toggle("drawer-open", Boolean(state.selectedCharacter));
    this.root.querySelector(".drawer-close")?.focus();
  }
}
