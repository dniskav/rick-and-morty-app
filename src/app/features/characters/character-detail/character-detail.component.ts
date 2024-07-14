import { Component, OnDestroy, OnInit } from '@angular/core';
import { RickAndMortyService } from '../../../core/services/rick-and-morty/rick-and-morty.service';
import { SubSink } from 'subsink';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private id: string | null = null;
  characterData: any;
  dataLoaded = false;
  currentPage: number = 0;
  currentName: string = ''
  images: string[] = [];
  
  constructor(private route: ActivatedRoute, private rickAndMortyService: RickAndMortyService) { }

  ngOnInit(): void {
    this.id  = this.route.snapshot.paramMap.get('id');
    this.loadCharacterDetail();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadCharacterDetail(): void {
    this.subs.sink = this.rickAndMortyService
      .getCharacter(this.id)
      .subscribe((data) => {
        this.characterData = data;
        this.currentName = this.characterData.name;
        this.loadCharacterImages(this.currentName);
      });
  }

  loadCharacterImages(name: string): void {
    this.subs.sink = this.rickAndMortyService
      .getCharacters(this.currentPage, { name })
      .subscribe((data) => {
        let preList = data.results.map((e: any) => e.image);
        this.images = [...new Set([...this.images, ...preList ])];
        this.dataLoaded = true;
      });
  }

  extractId(url: string): string | null {
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : null;
  }
}
