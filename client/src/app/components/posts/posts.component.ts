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

  @ViewChild(PopUpReportComponent) popUpReportComponent!: PopUpReportComponent;


  posts : any = []
  users : any = []

  ngOnInit(): void{
    this.getPosts();
  }

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
    

  makeReport(){
    this.popUpReportComponent.visible = true
  }
}
