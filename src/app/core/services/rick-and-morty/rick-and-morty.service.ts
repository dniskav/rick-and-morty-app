import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) { }

  buildQuery (data: any) {
    return new URLSearchParams(data).toString();
  }

  getCharacters(page: number, filter: any = {}): Observable<any> {
    const filterQuery = this.buildQuery(filter);
    return this.http.get(`${this.apiUrl}/character?page=${page}&${filterQuery}`);
  }

  getCharacter(id: string | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }

  getEpisodes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode`);
  }

  getEpisode(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`);
  }
}
