import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiConfigService } from '../services/api-config.service';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const baseUrl = inject(ApiConfigService).baseUrl.replace(/\/+$/, '');
  const path = req.url.replace(/^\/+/, '');

  return next(req.clone({ url: `${baseUrl}/${path}` }));
};
