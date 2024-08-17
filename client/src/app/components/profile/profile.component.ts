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
  dynamicParam !: string;
  postsOfUser : any = []
  userId !:any
  liked ! : boolean 
  showComments : boolean = false
  openMenu: boolean = false;
  openPostId: string | null = null;
  darkMode !: boolean 
  friends !: boolean
  visible: boolean = false;
  errorMessage : string = ""

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.dynamicParam = params['id'];
      console.log(this.dynamicParam);
      this.getUser();
      this.getUserPosts();
      this.checkFriend(this.dynamicParam)
    });

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
    this.userId = localStorage.getItem('_id')

    this.postService.addLike(post._id, this.userId).subscribe(
      (res)=>{
        post.LikedBy = res.post.LikedBy;   
        if (post.LikedBy.includes(this.userId)) {
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

  addFriend(friendUserId : string){
    this.userId = localStorage.getItem('_id')
    
    this.userService.friend(this.userId, friendUserId).subscribe(
      (res)=>{                
        window.location.reload();
      },
      (err)=>{
        console.log(err);
      }
    )
  }
  checkFriend(friendUserId : string) : any{
    this.userId = localStorage.getItem('_id')
    
    this.userService.checkFriend(this.userId, friendUserId).subscribe(
      (res : any)=>{
        this.friends = res
      },
      (err)=>{
        console.log(err);
      }
    )
  }
}
