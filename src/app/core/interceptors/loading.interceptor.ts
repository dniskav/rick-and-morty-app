import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { isLoading } from '../../shared/state/loading.state';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  isLoading.set(true);
  return next(req).pipe(finalize(() => isLoading.set(false)));
};
