import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
  public preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data && route.data['preload']) {
      return load();
    } else {
      return of(null);
    }
  }
}
