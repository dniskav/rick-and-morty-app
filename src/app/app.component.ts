import { isLoading } from './shared/state/loading.state';
import { Component, OnInit, NgZone, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from './core/services/loading/loading.service';
import { HeaderComponent } from './shared/components/header/header.component';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { UtilsService } from './core/services/utils/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rick-and-morty-app';
  public router = inject(Router);
  public auth = inject(AuthService);
  public isLoading = isLoading;

  goto(dir: string) {
    this.router.navigate([dir]);
  }
}
