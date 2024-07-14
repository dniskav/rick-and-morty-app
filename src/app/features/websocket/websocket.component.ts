import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../core/services/websocket/websocket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-websocket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './websocket.component.html',
  styleUrl: './websocket.component.css'
})
export class WebsocketComponent implements OnInit{

  messages: any[] = [];
  message = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.getMessages().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  sendMessage() {
    const { message } = this;
    this.message = '';
    this.webSocketService.sendMessage({ message });
  }
}
