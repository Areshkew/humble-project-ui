import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../utils/loading.service';

const excludedEndpoints = [
  '/api/book/search'
];

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);
  
  const isExcludedEndpoint = excludedEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isExcludedEndpoint) {
    return next(req);
  } else {
    loadingService.startLoading();
    return next(req).pipe(
      finalize(() => loadingService.stopLoading())
    );
  }
};
