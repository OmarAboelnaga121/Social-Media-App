import { Component } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private cookieService: CookieService, private userService : UserServicesService, private route: ActivatedRoute){}

  user : any = []
  cookieId : string = ''
  dynamicParam !: string;

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.dynamicParam = params['id'];
    });
    this.getUser();
  }

  getUser(){
      this.userService.getUser(this.dynamicParam).subscribe(
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
