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
  cookieId : string = ''
  user : any = []
  showPosts : boolean = true

  @ViewChild(PopUpPostComponent) popUpPostComponent!: PopUpPostComponent;
  @ViewChild(PostsComponent) postsComponent!: PostsComponent;

  
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

  formDataOutput(data : any){
    console.log(data);
    
    this.createPost(data)
  }

  openPopUp(){
    if (this.popUpPostComponent) {
      this.popUpPostComponent.visible = true;
    } else {
      console.log('PopUpPostComponent is not available');
    }

  }

}
