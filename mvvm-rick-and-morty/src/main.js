import "./styles.css";
import { RickAndMortyModel } from "./model/RickAndMortyModel.js";
import { CharactersView } from "./view/CharactersView.js";
import { CharactersViewModel } from "./viewmodel/CharactersViewModel.js";

const root = document.querySelector("#app");
const model = new RickAndMortyModel();
const viewModel = new CharactersViewModel(model);
const view = new CharactersView(root);

view.connect({
  onSearch: (filters) => viewModel.search(filters),
  onReset: () => viewModel.resetFilters(),
  onPrevious: () => viewModel.previousPage(),
  onNext: () => viewModel.nextPage(),
  onRetry: () => viewModel.retry(),
  onSelect: (id) => viewModel.selectCharacter(id),
  onClose: () => viewModel.closeDetails(),
});

viewModel.subscribe((state) => view.render(state));
viewModel.initialize();
