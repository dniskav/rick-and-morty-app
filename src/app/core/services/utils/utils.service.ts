
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  getSeasonNumber(id: string) {
    return { season: id.slice(0, 3), number: id.slice(-3)};
  }

  getCharactersIds(list: string[]) {
    return list.map(charUrl => this.extractId(charUrl)).join(',');
  }

  extractId(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : '';
  }
}