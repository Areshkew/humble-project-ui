import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@services/auth/auth.interceptor';
import { MessageService } from 'primeng/api';
import { loadingInterceptor } from '@services/httpconfig.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors(
      [authInterceptor, loadingInterceptor]
    )),
    MessageService
  ]
};
