import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '../../components/profile/profile.component';
import { PostsComponent } from "../../components/posts/posts.component";

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    ProfileComponent,
    PostsComponent,
]
})
export class DashboardModule { }
