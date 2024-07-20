import { Component } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

  constructor(private httpClient : UserServicesService, private messageService: MessageService){}


  sendDataForContact(name : string, mail : string, message : string){
    console.log(message);
    
    this.httpClient.sendContactData(name, mail, message).subscribe(
      (res) => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message has sent successfully' });
      },
      (err) => {
        console.log(err);

      }
    )
  }

}
