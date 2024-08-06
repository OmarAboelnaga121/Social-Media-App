import { Component, ViewChild } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { PostServicesService } from '../../../services/post-services.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, filter } from 'rxjs/operators';
import { PopUpPostComponent } from '../../../components/pop-up-post/pop-up-post.component';
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
  @ViewChild(PopUpPostComponent) popUpPostComponent!: PopUpPostComponent;
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
            },
            (error)=>{
              console.log(error);
              
            }
          )
        }
  )}

  // Fun to make the post
  createPost(data : any){
    this.postService.createPost(data).subscribe(
      (res)=>{
        this.postsComponent.getPosts()
        this.getUser()
        console.log(res);

      },
      (err)=>{
        console.log(err);
      }
    )
  }

  // fun which it takes the data of the pop up 
  formDataOutput(data : any){
    console.log(data);
    
    this.createPost(data)
  }

  // fun to open the pop up 
  openPopUp(){
    if (this.popUpPostComponent) {
      this.popUpPostComponent.visible = true;
    } else {
      console.log('PopUpPostComponent is not available');
    }

  }

  darkModeCheck(){
    if (this.cookieService.get('dark')) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
  }
}
