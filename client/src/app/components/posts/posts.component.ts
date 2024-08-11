import { Component, ViewChild } from '@angular/core';
import { PostServicesService } from '../../services/post-services.service';
import { UserServicesService } from '../../services/user-services.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { PopUpReportComponent } from "../pop-up-report/pop-up-report.component";
import { CookieService } from 'ngx-cookie-service';
import { CommentsComponentComponent } from "../comments-component/comments-component.component";
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [RouterModule, CommonModule, ToastModule, RippleModule, PopUpReportComponent, CommentsComponentComponent, InputTextModule],
  providers: [MessageService],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  constructor(private messageService: MessageService, private cookieService: CookieService, private postService : PostServicesService, private userService : UserServicesService){}

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
  cookieId : string = ''
  user : any = []
  visible: boolean = false;
  errorMessage : string = ""
  hoverStates: { [key: number]: boolean } = {}; 


  // On Initialize the page
  ngOnInit(): void{
    this.getUser()
    this.getPosts();
    this.darkModeCheck()
    this.posts.forEach((post : any) => {
      this.hoverStates[post._id] = false;
  });
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
  loadMorePosts(){
    this.postService.getPosts().subscribe(
      (data)=>{
        data.forEach((post: any) => this.getUserPost(post));
        this.posts.push(...data);

      },
      (error)=>{
        console.log(error);
      }
  )}

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

    // Fun to make the post
    makePost(description : string, fileInput: HTMLInputElement){
      const image = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
  
      const formData: FormData = new FormData();
      console.log(this.cookieService.get('_id'));
  
      if(description.length < 5){
        this.errorMessage = "Description have to be more than 5 characters"
        return 
  
      }
      
      formData.append('CreatorId', this.cookieService.get('_id'));
      formData.append('Description', description);
      if (image) {
        formData.append('image', image, image.name);
      }

      this.postService.createPost(formData).subscribe(
        (res)=>{
          console.log(res);
          this.getPosts();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Post has made successfully' });
        },
        (err)=>{
          console.log(err);
        }
      )
    }

    addFriend(friendUserId : string){
      const cookieId = this.cookieService.get('_id')
      
      this.userService.addFriend(cookieId, friendUserId).subscribe(
        (res)=>{
          window.location.reload();
        },
        (err)=>{
          console.log(err);
          
        }
      )
    }
}

