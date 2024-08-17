import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private httpClient : UserServicesService, private route : Router, private router: ActivatedRoute){}

  // Variables
  errorMessage : string = ''
  cookieId : string = ''

  ngOnInit() : void{
    this.router.queryParams.subscribe((params : any) => {
      const userId = params['id'];
      
      if (userId) {
        localStorage.setItem('_id', userId);
        window.location.reload()
        // this.route.navigate(['/dashboard'])
      }
      

    });
  }

  // Fun for user to login locally
  loginUserLocally(mail : string, password : string){

    if(!mail.includes('@')){
      this.errorMessage = 'Mail Have To Contain @'
    }

    this.httpClient.loginUserLocally(mail, password).subscribe(
      (res) => {
        localStorage.setItem('_id', res._id)
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
  }

    // Fun to log the user by discord
  loginDiscord(){
    this.httpClient.LoginUserDiscord()
  }

  
}
