import { Component, Output, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PostServicesService } from '../../services/post-services.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { PostsComponent } from '../posts/posts.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pop-up-post',
  standalone: true,
  imports: [DialogModule, InputTextModule, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './pop-up-post.component.html',
  styleUrl: './pop-up-post.component.scss'
})
export class PopUpPostComponent {
  constructor(private cookieService: CookieService, private messageService: MessageService){}
  visible: boolean = false;
  @Output() formDataOutput = new EventEmitter<any>();
  errorMessage : string = ""


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

    this.formDataOutput.emit(formData)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    this.visible = false
  }
}
