import { Component, HostListener } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../pipes/search.pipe';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [InputTextModule, RouterModule, CommonModule, FormsModule, SearchPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  // on initialize the project
  ngOnInit(): void{
    this.checkAuth()
    
    this.getAuthUser()
    this.darkModeCheck()
    // this.getUsers()
  }

  // Variacbles
  Authanticated ! : boolean 
  cookieId : string = ''
  openMenu : boolean = false
  user : any = {}
  users : any = []
  imageUrl ! : string
  darkMode !: boolean 
  searchValue : any = ''

  constructor(private httpClient : UserServicesService, private cookieService: CookieService, private route : Router){}
  
  // Function to open the menu for mobile
  openMenuFun(){
    this.openMenu = !this.openMenu
  }

  // Fun to check Auth
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

  // Fun to get the data of the authorized user
  getAuthUser(){
    this.cookieId = this.cookieService.get('_id');    

    this.httpClient.getUser(this.cookieId).subscribe(
      (data) => {
        this.user = data
        this.imageUrl = data.photo 
        
      },
      () => {
        this.httpClient.getUserProvider(this.cookieId).subscribe(
          (data) => {
            this.user = data
            this.imageUrl = data.photo 
            
          },
          (error) => {
            // console.log(error)
          }
        );
      }
    );
  }
  darkModeCheck(){
    if (this.cookieService.get('dark')) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
  }

  profileSearch(userId : any){
    this.route.navigate(['/dashboard/profile', userId]);
    this.users = [];  
  }
  onSearchChange(searchValue: string) {
    if (searchValue.length === 0) {
      this.users = [];  
    } else if (searchValue.length === 1 || searchValue.length >= 1) {
      this.getUsers();  
    }
  }

  getUsers(){

    this.httpClient.getUsers().subscribe(
      (data) => {
        
        const allUsers = [...data.discordUsers, ...data.googleUsers, ...data.users];
        this.users = allUsers
        console.log(allUsers);

      },
      (err) => {
        console.log(err);
        
      },
      
    );
  }
}
