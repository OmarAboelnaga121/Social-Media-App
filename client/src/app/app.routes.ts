import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardDashboard, AuthGuardForUnAuth } from '../auth.guard';
// import { RegisterComponent } from './modules/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuardForUnAuth]
    },
    {
        path: 'register',
        loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule),
        canActivate: [AuthGuardForUnAuth]
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuardDashboard]
    },
    {
        path: 'contact',
        loadChildren: () => import('./modules/contact-us/contact-us.module').then(m => m.ContactUsModule),
    },
    {
        path: 'about',
        loadChildren: () => import('./modules/about/about.module').then(m => m.AboutModule),
    },
    // {
    //     path: '**',
    //     loadChildren: () => import('./modules/not-found/not-found.module').then(m => m.NotFoundModule)
    // }
];
