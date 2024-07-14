import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { episodeModel } from '../../../core/models/episodes/episodes.model';
import { CommonModule } from '@angular/common';
import { InifiniteScrollDirective } from '../../../shared/directives/infinite-scroll/inifinite-scroll.directive';
import { TableSortDirective } from '../../../shared/directives/tableSort/table-sort.directive';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, InifiniteScrollDirective, TableSortDirective],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css'
})
export class EpisodeListComponent {
  @Input() currentPage: number = 0;
  @Input() episodes: episodeModel[] = [];
  @Output() loadMore = new EventEmitter<{}>();

  constructor(private router: Router) { }
  
  closeToBottom() {
    this.loadMore.emit();
  }

  goto(id: number) {
    this.router.navigate([`episode/${id}`]);
  }
}
