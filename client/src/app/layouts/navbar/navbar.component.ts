import { Component } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { RouterModule } from '@angular/router'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  ngOnInit(): void{
    this.checkAuth()
  }

  Authanticated ! : boolean 
  cookieId : string = ''


  constructor(private httpClient : UserServicesService, private cookieService: CookieService, private route : RouterModule){}

  checkAuth(){
    this.cookieId = this.cookieService.get('_id');

    if(!this.cookieId || this.cookieId == ''){
      this.Authanticated = false
      return;
    }

    this.httpClient.getUser(this.cookieId).subscribe(
      (res) => {
        this.Authanticated = true
        console.log(res)
      },
      (err) => {
        console.log(err)
      },
  )}

}
