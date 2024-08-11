import { Component } from '@angular/core';
import { UserServicesService } from '../../services/user-services.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostServicesService } from '../../services/post-services.service';
import { CommentsComponentComponent } from '../comments-component/comments-component.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CommentsComponentComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(private postService : PostServicesService, private cookieService: CookieService, private userService : UserServicesService, private route: ActivatedRoute){}

  user : any = []
  cookieId : string = ''
  dynamicParam !: string;
  postsOfUser : any = []

  liked ! : boolean 
  showComments : boolean = false
  openMenu: boolean = false;
  openPostId: string | null = null;
  darkMode !: boolean 
  visible: boolean = false;
  errorMessage : string = ""

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.dynamicParam = params['id'];
      console.log(this.dynamicParam);
    });
    this.getUser();
    this.getUserPosts();
  }

  getUser(){
    console.log(this.dynamicParam);

      this.userService.getUser(this.dynamicParam).subscribe(
        (data)=>{
          console.log(data);
          this.user = data
        },
        (error)=>{
          this.userService.getUserProvider(this.dynamicParam).subscribe(
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
  getUserPosts(){
      this.userService.getUserPosts(this.dynamicParam).subscribe(
        (data)=>{
          console.log(data);
          this.postsOfUser = data
        },
        (error)=>{
          console.log(error);
        }    
    )}


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
