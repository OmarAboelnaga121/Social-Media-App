import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of, forkJoin, map, catchError, Observable } from 'rxjs';
import { UserServicesService } from './app/services/user-services.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardDashboard implements CanActivate {

  constructor(private httpClient: UserServicesService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userIdStorage: string | null = localStorage.getItem('_id');

    if (!userIdStorage) {
      this.router.navigate(['/']);
      return of(false);
    }

    return this.httpClient.getUser(userIdStorage).pipe(
      map(user => {
        if (user) {
          return true; // User is authenticated
        } else {
          this.router.navigate(['/']);
          return false; // User is not authenticated
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }  
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardForUnAuth implements CanActivate {

  constructor(private httpClient: UserServicesService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const userIdStorage: string | null = localStorage.getItem('_id');

    if (!userIdStorage) {
      return of(true); // No user ID, so allow access
    }

    return this.httpClient.getUser(userIdStorage).pipe(
      map(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
          return false; // User is authenticated, redirect to dashboard
        } else {
          return true; // User is not authenticated
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(true); // Redirect to home if there's an error
      })
    );
  }  
}
