import { characterModel } from './../characters/characters/characters.model';

export interface sortEventModel {
  column: string;
  direction: number;
}

export type field = 'name' | 'status' | 'species' | 'episode';
