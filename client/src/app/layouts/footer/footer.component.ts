import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private route : Router, private cookieService : CookieService){}
  remveFooterForDashboard : boolean = false
  darkMode !: boolean 

  // To check if the user is auth or not if it is auth it does it do not appear if it is not auth it appears
  ngOnInit() {
    this.darkModeCheck()
    this.route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.remveFooterForDashboard = !event.url.startsWith('/dashboard');
      });
  }

  darkModeCheck(){
    if (this.cookieService.get('dark')) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
  }
}
