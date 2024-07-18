import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { RegisterComponent } from './modules/register/register.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "register",
        loadChildren: () => import("./modules/register/register.module").then(
            (m) => m.RegisterModule
        )
    },
    {
        path: "dashboard",
        loadChildren: () => import("./modules/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
        )
    },
];
