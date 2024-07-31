import { Component } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private cookieService: CookieService, private userService : UserServicesService){}

  user : any = []
  cookieId : string = ''

  ngOnInit(): void{
    this.getUser();
  }

  getUser(){
      this.cookieId = this.cookieService.get('_id');    

      this.userService.getUser(this.cookieId).subscribe(
        (data)=>{
          console.log(data);
          this.user = data
        },
        (error)=>{
          this.userService.getUserProvider(this.cookieId).subscribe(
            (data)=>{
              console.log(data);
              this.user = data
            },
            (error)=>{
              console.log(error);
              
            }
          )
        }
    )}

}
