import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(private cookieService : CookieService, private router: Router){}

  darkMode(){
    const darkModeCookie = this.cookieService.get('dark');

    if (!darkModeCookie) {
      this.cookieService.set('dark', 'true', undefined, '/');
    } else {
      this.cookieService.delete('dark', '/');
    }
  
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    });
    
  }
  logOut(){
    this.cookieService.delete('_id', '/',);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });

  }
}
