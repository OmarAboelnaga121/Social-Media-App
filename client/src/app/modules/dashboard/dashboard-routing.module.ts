import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { PostsComponent } from '../../components/posts/posts.component';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: 'settings', component: SettingsComponent },
      { path: 'profile/:id', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
