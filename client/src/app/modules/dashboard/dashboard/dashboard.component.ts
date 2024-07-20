import { Component } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private httpClient : UserServicesService, private route : Router, private cookieService: CookieService){}
  cookieId : string = ''

}
