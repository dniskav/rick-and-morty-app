export interface characterModel {
  id: number;
  image: string;
  name: string;
  status: string;
  species: string;
  episode: {
    length: number;
  }
}
