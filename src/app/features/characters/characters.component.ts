import { CharacterListComponent } from './character-list/character-list.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RickAndMortyService } from '../../core/services/rick-and-morty/rick-and-morty.service';
import { characterModel } from '../../core/models/characters/characters/characters.model';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { field } from '../../core/models/utils/sortEvent.model';
import { SubSink } from 'subsink';
import { InifiniteScrollDirective } from '../../shared/directives/infinite-scroll/inifinite-scroll.directive';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    FormsModule,
    CharacterListComponent,
    CommonModule,
    InifiniteScrollDirective,
  ],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit, OnDestroy {
  filter = { name: '', status: '', species: '' };
  characters: characterModel[] = [];
  currentPage: number = 0;
  endOfList = false;
  column: field = 'name';
  direction = 1;
  characterStatus = [
    { name: 'All', code: '' },
    { name: 'Alive', code: 'Alive' },
    { name: 'Dead', code: 'Dead' },
    { name: 'unknown', code: 'Unknown' },
  ];
  private subs = new SubSink();

  constructor(private rickAndMortyService: RickAndMortyService) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(resetPage: boolean = false): void {
    if (resetPage) {
      this.currentPage = 1;
      this.endOfList = false;
    }

    this.subs.sink = this.rickAndMortyService
      .getCharacters(this.currentPage, this.filter)
      .subscribe((data) => {
        this.characters = data.results;
      });
  }

  clearFilters() {
    this.filter = { name: '', status: '', species: '' };
    this.endOfList = false;
    this.loadCharacters(true);
  }

  loadMore(): void {
    this.currentPage++;
    this.subs.sink = this.rickAndMortyService
      .getCharacters(this.currentPage, this.filter)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          this.endOfList = true;
          this.currentPage--;
          return of();
        }),
      )
      .subscribe((data) => {
        let preList = [...new Set([...this.characters,...data.results])];
        preList = [...new Set(preList.map(e => JSON.stringify(e)))];
        this.characters = preList.map(e => JSON.parse(e));
        // if(this.column) {
        //   this.characters = this.sort(this.characters, this.column, this.direction);
        // }
        // this.endOfList = false;
      });
  }

  sortBy(event: any) {
    this.column = event.column;
    this.direction = event.direction;

    this.characters = this.sort(this.characters, this.column, this.direction);
  }

  sort(list: characterModel[], column: field, direction: number) {
    const sortedList = list.sort((a: characterModel, b: characterModel) => {
      const ap = column === 'episode' ? a[column].length : a[column];
      const bp = column === 'episode' ? b[column].length : b[column];

      return ap > bp ? 1 * direction : -1 * direction;
    });
    return sortedList;
  }
}
