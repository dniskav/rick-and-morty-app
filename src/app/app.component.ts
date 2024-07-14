import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './core/services/loading/loading.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'rick-and-morty-app';
  isLoading: boolean;
  
  constructor(private router: Router, loading: LoadingService) {
    this.isLoading = loading.getLoading();
  }
  ngOnInit(): void {

  }
  
  goto(dir: string) {
    this.router.navigate([dir]);
  }
}
