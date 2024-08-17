import { Component, Input } from '@angular/core';
import { PostServicesService } from '../../services/post-services.service';
import { UserServicesService } from '../../services/user-services.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-comments-component',
  standalone: true,
  imports: [CommonModule, InputTextModule],
  templateUrl: './comments-component.component.html',
  styleUrl: './comments-component.component.scss'
})
export class CommentsComponentComponent {
  constructor(private postService : PostServicesService, private userService : UserServicesService, private cookieService: CookieService){}

  @Input() postComments : any
  openMenu: boolean = false;
  userId !: any

  ngOnInit() : void {    
    console.log(this.postComments.Comments);
    
  }

  addComment(commentPostText : string){
    this.userId = localStorage.getItem('_id');
    const commentPostId = this.postComments._id

    this.postService.addCommentForPost(commentPostId, this.userId, commentPostText).subscribe(
      (res)=>{
        this.postComments.Comments.push(res)
      },
      (err)=>{
        console.log(err);
      }
    )
  }

}
