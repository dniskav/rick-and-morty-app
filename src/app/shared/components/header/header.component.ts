import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UtilsService } from '../../../core/services/utils/utils.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  document = window.document;
  utils: UtilsService;

  constructor(private router: Router, public auth: AuthService, utils: UtilsService){
    this.utils = utils;
  }

  ngOnInit(): void {
    this.utils.playAudio();
  }
  
  goto(dir: string) {
    this.router.navigate([dir]);
  }

  togglePlayStop() {
    this.utils.togglePlay();
  }

  toggleRepeat() {
    this.utils.toggleRepeat();
  }
}
