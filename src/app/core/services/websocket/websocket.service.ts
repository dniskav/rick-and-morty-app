import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('wss://ws.postman-echo.com/raw');
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }
}
