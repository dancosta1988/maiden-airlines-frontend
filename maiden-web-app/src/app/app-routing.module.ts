import { OperatorViewComponent } from "./operator-view/operator-view.component";
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import { HomeComponent } from './home/home.component';
import { BackofficeLoginComponent } from './backoffice-login/backoffice-login.component';
import { ClubComponent } from './club/club.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch : 'full'},
    {path: 'home', component: HomeComponent },
    {path: 'operator', component: OperatorViewComponent },
    {path: 'backoffice-login', component: BackofficeLoginComponent },
    {path: 'club', component: ClubComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{

}