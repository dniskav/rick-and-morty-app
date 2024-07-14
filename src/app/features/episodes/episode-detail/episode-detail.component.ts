import { characterModel } from './../../../core/models/characters/characters/characters.model';
import { episodeModel } from './../../../core/models/episodes/episodes.model';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { RickAndMortyService } from '../../../core/services/rick-and-morty/rick-and-morty.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { ImageLoaderDirective } from '../../../shared/directives/imageLoader/image-loader.directive';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [CommonModule, ImageLoaderDirective,],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.css'
})
export class EpisodeDetailComponent {
  private subs = new SubSink();
  private id: string | null = null;
  episodeData: episodeModel = {
    id: 0,
    name: '',
    air_date: '',
    episode: '',
    characters: [],
    url: '',
    created: ''
  };
  characterIds = '';
  charactersList: characterModel []= [];
  dataLoaded = false;
  currentPage: number = 0;
  currentName: string = ''
  images: string[] = [];
  utils: UtilsService;
  
  constructor(private router: Router, private route: ActivatedRoute, private rickAndMortyService: RickAndMortyService, utils: UtilsService) { 
    this.utils = utils;
  }

  ngOnInit(): void {
    this.id  = this.route.snapshot.paramMap.get('id');
    this.loadCharacterDetail();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCharacterDetail(): void {
    this.subs.sink = this.rickAndMortyService
      .getEpisode(this.id)
      .subscribe((data) => {
        this.episodeData = data;
        const { season, number } = this.utils.getSeasonNumber(data.episode);

        this.episodeData.season = season;
        this.episodeData.number = number;
        this.characterIds = this.utils.getCharactersIds(this.episodeData.characters);
        this.loadCharactersList();
        this.dataLoaded = true;
      });
  }

  loadCharactersList(): void {
    this.subs.sink = this.rickAndMortyService
      .getCharacter(this.characterIds)
      .subscribe((data) => {
        this.charactersList = data;
      });
  }

  goto(id: number) {
    this.router.navigate([`character/${id}`]);
  }

  print() {
    window.print();
  }
}
