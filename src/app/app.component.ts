import { Component, OnInit, NgZone } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'rick-and-morty-app';
  loading$: Observable<boolean>;

  constructor(
    private utils: UtilsService,
    private router: Router,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    public auth: AuthService,
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.loading$.subscribe(() => {
      this.ngZone.run(() => {
        this.cdr.detectChanges();
      });
    });
  }

  goto(dir: string) {
    this.router.navigate([dir]);
  }
}
