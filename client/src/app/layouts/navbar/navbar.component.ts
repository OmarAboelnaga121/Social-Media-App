import { Component, HostListener } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [InputTextModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  ngOnInit(): void{
    this.checkAuth()
  }

  Authanticated ! : boolean 
  cookieId : string = ''
  openMenu : boolean = false


  constructor(private httpClient : UserServicesService, private cookieService: CookieService, private route : Router){}
  
  openMenuFun(){
    this.openMenu = !this.openMenu
  }

  checkAuth(){
    this.cookieId = this.cookieService.get('_id');    

    if(this.cookieId == '' || !this.cookieId){
      this.Authanticated = false
      return;
    }
    // Check In USER DataBase
    this.httpClient.getUser(this.cookieId).subscribe(
      () => {
        this.Authanticated = true;
      },
      () => {
        this.httpClient.getUserProvider(this.cookieId).subscribe(
          () => {
            this.Authanticated = true;
          },
          () => {
            this.Authanticated = false;
          }
        );
      }
    );
}

}
