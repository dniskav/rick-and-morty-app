import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { routes } from './app.routes';
import { AuthModule } from '@auth0/auth0-angular';
import { authConfig } from './auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    importProvidersFrom(AuthModule.forRoot(authConfig)),
    provideAnimations(),
  ]
};
