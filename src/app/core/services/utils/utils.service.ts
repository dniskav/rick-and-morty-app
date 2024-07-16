
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private audio = new Audio();
  private isPlaying = false;
  private isRepeat = false;

  constructor() {
    this.audio.src = 'assets/music/rym.mp3';
    this.audio.load();
  }

  playAudio() {
    if (!this.isPlaying) {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
          localStorage.setItem('audioPlayed', 'true');
        })
        .catch(error => console.error('Error playing audio:', error));
    }
  }

  stopAudio() {
    if (this.isPlaying) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(error => console.error('Error playing audio:', error));
    }
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.audio.loop = this.isRepeat;
  }

  get isAudioPlaying() {
    return this.isPlaying;
  }

  get isAudioRepeat() {
    return this.isRepeat;
  }

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

  noDupesJoin(itemsList1: any[], itemsList2: any[]): any[] {
    const joined = [...itemsList1,...itemsList2];
    let preList = new Set([...joined.map(e => JSON.stringify(e))]);
    let list = Array.from(preList).map(e => JSON.parse(e));
    return list;
  }
}