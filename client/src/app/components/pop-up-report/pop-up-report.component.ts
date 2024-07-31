import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PostServicesService } from '../../services/post-services.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-pop-up-report',
  standalone: true,
  imports: [DialogModule, InputTextModule, CommonModule, ToastModule, ConfirmPopupModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pop-up-report.component.html',
  styleUrl: './pop-up-report.component.scss'
})
export class PopUpReportComponent {
  // Variables
  visible: boolean = false;
  @Input() reportedPostId ! : string;
  @Output() reportData = new EventEmitter<any>();
  errorMessage : string = ""

  constructor(private confirmationService: ConfirmationService,private cookieService: CookieService, private messageService: MessageService, private postService : PostServicesService){}

  // Fun to make a reporte
  makeReport(resportResoan : string, event: Event){
    const reporterId : string = this.cookieService.get('_id')
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.postService.addReportForPost(this.reportedPostId, reporterId, resportResoan).subscribe(
          (res) => {
            this.visible = false
          },
          (err) => {
            this.errorMessage = err.error.msg
          }
        )
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Thank You for helping the website to be better', life: 3000 });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected To make the report', life: 3000 });
      }
    });

  }
}
