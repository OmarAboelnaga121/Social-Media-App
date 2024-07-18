import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputTextModule, FloatLabelModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private httpClient : UserServicesService, private route : Router, private cookieService: CookieService){}

  // Variables
  errorMsg : string = ''
  cookieId : string = ''

  // On Opning the page
  ngOnInit(): void{
    this.checkAuth()
  }

  // Fun for user to login locally
  loginUserLocally(mail : string, password : string){

    if(! mail.includes('@')){
      this.errorMsg = 'Mail Have To Contain @'
    }

    this.httpClient.loginUserLocally(mail, password).subscribe(
      (res) => {
        this.cookieService.set('_id', res._id)
        this.checkAuth()
      },
      (err) => {
        this.errorMsg = err
        console.log(err)
      },
    )
  }

  loginGoogle(){
    this.httpClient.loginUserGoogle().subscribe(
      (res) => {
        console.log(res);
        // this.cookieService.set('_id', res._id)
        // this.checkAuth()
      },
      (err) => {
        this.errorMsg = err
        console.log(err)
    },)
  }
  loginDiscord(){
    this.httpClient.loginUserDiscord().subscribe(
      (res) => {
        console.log(res);
        
        // this.cookieService.set('_id', res._id)
        // this.checkAuth()
      },
      (err) => {
        this.errorMsg = err
        console.log(err)
    },)
  }

  //Check if user is logged in or not 
  checkAuth(){
    this.cookieId = this.cookieService.get('_id');    

    if(this.cookieId == ''){
      return;
    }
    this.httpClient.getUser(this.cookieId).subscribe(
      (res) => {
        this.route.navigate(['/dashboard'])
      },
      (err) => {
        console.log(err)
      },
  )}
}
