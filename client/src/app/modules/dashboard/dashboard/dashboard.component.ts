import { Component, ViewChild } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { PostServicesService } from '../../../services/post-services.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, filter } from 'rxjs/operators';
import { PostsComponent } from '../../../components/posts/posts.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private router: ActivatedRoute ,private userService : UserServicesService, private postService : PostServicesService, private route : Router, private cookieService: CookieService){
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showPosts = this.route.url === '/dashboard';
    });

  }
  // Variables
  cookieId : string = ''
  user : any = []
  showPosts : boolean = true
  darkMode !: boolean 

  // View Childs to get access to
  @ViewChild(PostsComponent) postsComponent!: PostsComponent;

  // On initialize the page
  ngOnInit(): void{
    this.getUser();
    this.darkModeCheck();
  }

  // Fun to get user data
  getUser(){
      this.cookieId = this.cookieService.get('_id');    

      this.userService.getUser(this.cookieId).subscribe(
        (data)=>{
          this.user = data
        },
        (error)=>{
          this.userService.getUserProvider(this.cookieId).subscribe(
            (data)=>{
              this.user = data
              console.log(data);
              
            },
            (error)=>{
              console.log(error);
              
            }
          )
        }
  )}

  darkModeCheck(){
    if (this.cookieService.get('dark')) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
  }

  deleteFrind(friendUserId : string){
    const cookieId = this.cookieService.get('_id')
    
    this.userService.deleteFriend(cookieId, friendUserId).subscribe(
      (res)=>{
        console.log(this.user);
        console.log(friendUserId);
        
        console.log(res);
        this.user = res
        
      },
      (err)=>{
        console.log(err);
        
      }
    )
  }
}
