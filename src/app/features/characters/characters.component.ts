import { UtilsService } from './../../core/services/utils/utils.service';
import { CharacterListComponent } from './character-list/character-list.component';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RickAndMortyService } from '../../core/services/rick-and-morty/rick-and-morty.service';
import { characterModel } from '../../core/models/characters/characters/characters.model';
import { catchError } from 'rxjs/operators';
import { Observable, of, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { field } from '../../core/models/utils/sortEvent.model';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll/inifinite-scroll.directive';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    FormsModule,
    CharacterListComponent,
    CommonModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit {
  filter = signal({ name: '', status: '', species: '' });
  // characters: characterModel[] = [];
  characters = signal<characterModel[]>([]);
  currentPage = signal<number>(1);
  endOfList = signal<boolean>(false);
  column = signal<field>('name');
  direction = signal<number>(1);
  totalResults = signal<{ current: number; total: number}>({ current: 0, total: 0});
  characterStatus = [
    { name: 'All', code: '' },
    { name: 'Alive', code: 'Alive' },
    { name: 'Dead', code: 'Dead' },
    { name: 'unknown', code: 'Unknown' },
  ];

  constructor() {}
  private rickAndMortyService = inject(RickAndMortyService);
  private utils = inject(UtilsService);

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(resetPage: boolean = false): void {
    if (resetPage) {
      this.currentPage.set(1);
      this.endOfList.set(false);
    }

    this.rickAndMortyService
      .getCharacters(this.currentPage(), this.filter())
      .pipe(catchError(err => {
        console.log(err);
        this.endOfList.set(true);
        this.currentPage.update(page => page--);
        return of();
      }))
      .subscribe((data) => {
        this.characters.set(data.results);
        this.totalResults.set({ current: this.characters().length, total: data.info.count});
      });
  }

  clearFilters() {
    this.filter.set({ name: '', status: '', species: '' });
    this.endOfList.set(false);
    this.loadCharacters(true);
  }

  loadMore(): void {
    this.currentPage.update(page => page + 1);
    this.rickAndMortyService
      .getCharacters(this.currentPage(), this.filter())
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          this.endOfList.set(true);
          this.currentPage.update(page => page - 1);
          return of();
        }),
      )
      .subscribe((data) => {
        this.characters.set(this.utils.noDupesJoin(this.characters(), data.results));
        this.totalResults.set({ current: this.characters().length, total: data.info.count})
      });
  }

  sortBy(event: any) {
    this.column.set(event.column);
    this.direction.set(event.direction);

    this.characters.set(this.sort(this.characters(), this.column(), this.direction()));
  }

  sort(list: characterModel[], column: field, direction: number) {
    const sortedList = list.sort((a: characterModel, b: characterModel) => {
      const ap = column === 'episode' ? a[column].length : a[column];
      const bp = column === 'episode' ? b[column].length : b[column];

      return ap > bp ? 1 * direction : -1 * direction;
    });
    return sortedList;
  }

  updateFilter(prop: any, ev: any): void {
    this.filter.set({ ...this.filter(), [prop]: ev.target.value});
  }
}
