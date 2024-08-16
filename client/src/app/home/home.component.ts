import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private httpClient : UserServicesService, private cookieService: CookieService, private route : Router){}

  // Variables
  errorMessage : string = ''
  cookieId : string = ''

  // Fun for user to login locally
  loginUserLocally(mail : string, password : string){

    if(!mail.includes('@')){
      this.errorMessage = 'Mail Have To Contain @'
    }

    this.httpClient.loginUserLocally(mail, password).subscribe(
      (res) => {
        this.cookieService.set('_id', res._id)
        this.route.navigate(['/dashboard'])
        window.location.reload()
      },
      (err) => {
        this.errorMessage = 'Mail or Password is invalid';
      }
    )
  }

  // Fun to log the user by google
  loginGoogle() {
    this.httpClient.LoginUserGoogle()
    console.log(document.cookie);

  }

    // Fun to log the user by discord
  loginDiscord(){
    this.httpClient.LoginUserDiscord()
  }

  
}
