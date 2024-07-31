import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of, forkJoin, map, catchError, Observable } from 'rxjs';
import { UserServicesService } from './app/services/user-services.service';

@Injectable({
  providedIn: 'root'
})
 // this canActive is made for auth
export class AuthGuardDashboard implements CanActivate {

  constructor(private httpClient: UserServicesService, private router: Router, private cookieService: CookieService) {}

  canActivate(): Observable<boolean> {
    const userCookie = this.cookieService.get('_id');     

    return forkJoin({
        user: this.httpClient.getUser(userCookie).pipe(
          catchError(() => of(null)) // Handle error, return null if user request fails
        ),
        provider: this.httpClient.getUserProvider(userCookie).pipe(
          catchError(() => of(null)) // Handle error, return null if provider request fails
        )
      }).pipe(
        map(results => {
          const { user, provider } = results;
          if (user || provider) {
            // At least one of the requests succeeded
            return true;
          } else {
            // Both requests failed or user is invalid
            this.router.navigate(['/']);
            return false;
          }
        })
      );
  }  
}
// this canActive is made for unauth
export class AuthGuardForUnAuth implements CanActivate {

  constructor(private httpClient: UserServicesService, private router: Router, private cookieService: CookieService) {}

  // this canActive is made for unauth
  canActivate(): Observable<boolean> {
    const userCookie = this.cookieService.get('_id');

    if (!userCookie) {
      return of(true);
    }

    return forkJoin({
        user: this.httpClient.getUser(userCookie).pipe(
          catchError(() => of(null)) // Handle error, return null if user request fails
        ),
        provider: this.httpClient.getUserProvider(userCookie).pipe(
          catchError(() => of(null)) // Handle error, return null if provider request fails
        )
      }).pipe(
        map(results => {
          const { user, provider } = results;
          if (user || provider) {
            this.router.navigate(['/dashboard']);
            return false;
          } else {
            return true;
          }
        })
      );
  }  
}
