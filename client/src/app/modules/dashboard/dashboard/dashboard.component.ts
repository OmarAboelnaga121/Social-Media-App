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
  userId !: any 


  // View Childs to get access to
  @ViewChild(PostsComponent) postsComponent!: PostsComponent;

  // On initialize the page
  ngOnInit(): void{
    this.router.queryParams.subscribe((params : any) => {
      const token = params['token'];
      const userId = params['id'];
      
      if (userId) {
        localStorage.setItem('_id', userId);
      }
      

      if (token) {
        localStorage.setItem('token', token);
      }
    });

    this.getUser();
    this.darkModeCheck();
  }

  // Fun to get user data
  getUser(){
      // this.cookieId = this.cookieService.get('_id');    
      this.userId = localStorage.getItem('_id')


      this.userService.getUser(this.userId).subscribe(
        (data)=>{
          this.user = data
        },
        (error)=>{
          console.log(error);
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
    // const cookieId = this.cookieService.get('_id')
    this.userId = localStorage.getItem('_id')

    
    this.userService.friend(this.userId, friendUserId).subscribe(
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
