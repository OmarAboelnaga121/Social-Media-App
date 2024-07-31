import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private route : Router){}
  remveFooterForDashboard : boolean = false

  // To check if the user is auth or not if it is auth it does it do not appear if it is not auth it appears
  ngOnInit() {
    this.route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.remveFooterForDashboard = !event.url.startsWith('/dashboard');
      });
  }
}
