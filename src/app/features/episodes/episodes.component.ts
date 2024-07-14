import { Component, OnDestroy, OnInit } from '@angular/core';
import { EpisodeListComponent } from './episode-list/episode-list.component';
import { CommonModule } from '@angular/common';
import { episodeModel } from '../../core/models/episodes/episodes.model';
import { SubSink } from 'subsink';
import { RickAndMortyService } from '../../core/services/rick-and-morty/rick-and-morty.service';
import { catchError, Observable, of } from 'rxjs';
import { UtilsService } from '../../core/services/utils/utils.service';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [EpisodeListComponent, CommonModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css'
})
export class EpisodesComponent implements OnInit, OnDestroy{
  episodes: episodeModel[] = [];
  currentPage: number = 0;
  lastPage = 0;
  utils: UtilsService;

  private subs = new SubSink();

  constructor(private rickAndMortyService: RickAndMortyService, utils: UtilsService) {
    this.utils = utils;
  }

  loadEpisodes(): void {
    this.subs.sink = this.rickAndMortyService
      .getEpisodes(this.currentPage)
      .subscribe((data) => {
        this.lastPage = data.info.pages;
        this.currentPage = 1;
        this.episodes = data.results.map((e: episodeModel) => ({...e, ...this.utils.getSeasonNumber(e.episode)}));
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadMore(): void {
    this.currentPage++;
    if (this.currentPage > this.lastPage ) return;
    this.subs.sink = this.rickAndMortyService
      .getEpisodes(this.currentPage)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          this.currentPage--;
          return of();
        }),
      )
      .subscribe((data) => {
        this.episodes = [...new Set([...this.episodes,...data.results])].map((e: episodeModel) => ({...e, ...this.utils.getSeasonNumber(e.episode)}));
      });
  }

  onScroll() {
    console.log('here!');
  }

}
