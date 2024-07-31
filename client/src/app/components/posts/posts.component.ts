import { Component, ViewChild } from '@angular/core';
import { PostServicesService } from '../../services/post-services.service';
import { UserServicesService } from '../../services/user-services.service';
import { CommonModule } from '@angular/common';
import { PopUpPostComponent } from '../../components/pop-up-post/pop-up-post.component';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { PopUpReportComponent } from "../pop-up-report/pop-up-report.component";


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, ToastModule, RippleModule, PopUpReportComponent],
  providers: [MessageService],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  constructor(private postService : PostServicesService, private userService : UserServicesService){}

  // View child for children to controll on them
  @ViewChild(PopUpReportComponent) popUpReportComponent!: PopUpReportComponent;

  // Variables
  posts : any = []

  // On Initialize the page
  ngOnInit(): void{
    this.getPosts();
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
  addLike(){}
}
