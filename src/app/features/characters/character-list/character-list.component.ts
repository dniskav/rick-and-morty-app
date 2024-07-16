import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { characterModel } from '../../../core/models/characters/characters/characters.model';
import { sortEventModel } from '../../../core/models/utils/sortEvent.model';
import { ImageLoaderDirective } from '../../../shared/directives/imageLoader/image-loader.directive';
import { TableSortDirective } from '../../../shared/directives/tableSort/table-sort.directive';
import { Router } from '@angular/router';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll/inifinite-scroll.directive';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, ImageLoaderDirective, TableSortDirective],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent {
  @Input() currentPage: number = 0;
  @Input() characters: characterModel[] = [];
  @Input() endOfList: boolean = false;
  @Output() isSorting = new EventEmitter<{}>();
  @Output() loadMore = new EventEmitter<{}>();
  
  constructor(private router: Router) { }
  
  closeToBottom() {
    this.loadMore.emit();
  }

  customSort (ev: sortEventModel) {
    const { column, direction } = ev;

    this.isSorting.emit({
      column,
      direction,
    })
  }

  goto(id: number) {
    this.router.navigate([`character/${id}`]);
  }
}
