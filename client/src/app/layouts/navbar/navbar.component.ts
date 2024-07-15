import { Component } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  ngOnInit(): void{
    this.checkUser()
  }

  Authanticated ! : boolean 


  constructor(private http : UserServicesService){}

  checkUser() {
    this.http.checkUser().subscribe((result) =>{
      this.Authanticated = result
    })
  }

}
