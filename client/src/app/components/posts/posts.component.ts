import { Component, ViewChild } from '@angular/core';
import { PostServicesService } from '../../services/post-services.service';
import { UserServicesService } from '../../services/user-services.service';
import { CommonModule } from '@angular/common';
import { PopUpPostComponent } from '../../components/pop-up-post/pop-up-post.component';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { PopUpReportComponent } from "../pop-up-report/pop-up-report.component";
import { CookieService } from 'ngx-cookie-service';
import { CommentsComponentComponent } from "../comments-component/comments-component.component";


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, ToastModule, RippleModule, PopUpReportComponent, CommentsComponentComponent],
  providers: [MessageService],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  constructor(private postService : PostServicesService, private userService : UserServicesService, private cookieService: CookieService){}

  // View child for children to controll on them
  @ViewChild(PopUpReportComponent) popUpReportComponent!: PopUpReportComponent;
  @ViewChild(CommentsComponentComponent) commentsComponentComponent!: CommentsComponentComponent;

  // Variables
  posts : any = []
  liked ! : boolean 
  showComments : boolean = false
  openMenu: boolean = false;
  openPostId: string | null = null;
  darkMode !: boolean 


  // On Initialize the page
  ngOnInit(): void{
    this.getPosts();
    this.darkModeCheck()
  }

  // Fun to get all posts
  getPosts(){
    this.postService.getPosts().subscribe(
      (data)=>{
        this.posts = data;
        this.posts.forEach((post : any) => this.getUserPost(post));

      },
      (error)=>{
        console.log(error);
      }
  )}

  //Fun to get the user's posts 
  getUserPost(post : any){
      this.userService.getUser(post.CreatorId).subscribe(
        (data)=>{
          post.userDetails = data; 

        },
        (error)=>{
          this.userService.getUserProvider(post.CreatorId).subscribe(
            (data)=>{
              post.userDetails = data; 
              console.log(this.posts);
  
            },
            (error)=>{
              console.log(error);
            }
      )
        }
  )}
    
  // Fun to open the pop up of the report pop up
  makeReport(){
    this.popUpReportComponent.visible = true
  }

  // Fun to add or remove like
  addLike(post : any){
    const userId = this.cookieService.get('_id')

    this.postService.addLike(post._id, userId).subscribe(
      (res)=>{
        post.LikedBy = res.post.LikedBy;   
        if (post.LikedBy.includes(userId)) {
          post.Likes += 1;
        } else {
            post.Likes -= 1;
        }     
      }
    )
  }

  isLiked(post: any): boolean {
    return post.LikedBy.includes(this.cookieService.get('_id'));
  }

  comment(postId : string){
    if (this.openPostId === postId) {
      this.openPostId = null;
    } else {
      this.openPostId = postId;
    }

  }

  isPostOpen(postId: string): boolean {
    return this.openPostId === postId;
  }

  
  darkModeCheck(){
    if (this.cookieService.get('dark')) {
      this.darkMode = true;
    } else {
      this.darkMode = false;
    }
  }
}
