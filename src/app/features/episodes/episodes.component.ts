import { Component, OnDestroy, OnInit } from '@angular/core';
import { EpisodeListComponent } from './episode-list/episode-list.component';
import { InifiniteScrollDirective } from '../../shared/directives/infinite-scroll/inifinite-scroll.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [EpisodeListComponent, InifiniteScrollDirective, CommonModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css'
})
export class EpisodesComponent implements OnInit, OnDestroy{

  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }

  onScroll() {
    console.log('here!');
  }

}
