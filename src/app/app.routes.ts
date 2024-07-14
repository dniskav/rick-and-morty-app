import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersComponent } from './features/characters/characters.component';
import { CharacterDetailComponent } from './features/characters/character-detail/character-detail.component';
import { EpisodesComponent } from './features/episodes/episodes.component';
import { EpisodeDetailComponent } from './features/episodes/episode-detail/episode-detail.component';
import { WebsocketComponent } from './features/websocket/websocket.component';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: 'characters', component: CharactersComponent },
  { path: 'character/:id', component: CharacterDetailComponent },
  { path: 'episodes', component: EpisodesComponent },
  { path: 'episode/:id', component: EpisodeDetailComponent },
  { path: 'websocket', component: WebsocketComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
