import { Component } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private httpClient : UserServicesService, private cookieService: CookieService, private route : Router){}

  // Variables
  errorMessage : string = ''

  // fun to register account for user
  registerUser(displayName : string, mail : string, password : string, fileInput: HTMLInputElement){
    const image = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    const formData: FormData = new FormData();
    formData.append('displayName', displayName);
    formData.append('mail', mail);
    formData.append('password', password);
    if (image) {
      formData.append('image', image, image.name);
    }

    this.httpClient.registerUser(formData).subscribe(
      (res) => {
        console.log("Res"); 
        this.route.navigate(['/'])
      },
      (err) => {
        this.errorMessage = err.error.message;
      }
    )
  }
  
  // fun to register the user by google
  loginGoogle() {
    this.httpClient.LoginUserGoogle()
  }

  // fun to register the user by discord
  loginDiscord(){
    this.httpClient.LoginUserDiscord()
  }
}
