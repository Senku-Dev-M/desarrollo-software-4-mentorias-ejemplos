export class Character {
  constructor({
    id,
    name,
    status,
    species,
    type,
    gender,
    origin,
    location,
    image,
    episodeCount,
  }) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.species = species;
    this.type = type;
    this.gender = gender;
    this.origin = origin;
    this.location = location;
    this.image = image;
    this.episodeCount = episodeCount;
    Object.freeze(this);
  }

  static fromApi(data) {
    return new Character({
      id: data.id,
      name: data.name,
      status: data.status,
      species: data.species,
      type: data.type || "Sin subtipo",
      gender: data.gender,
      origin: data.origin?.name ?? "Desconocido",
      location: data.location?.name ?? "Desconocida",
      image: data.image,
      episodeCount: data.episode?.length ?? 0,
    });
  }
}
