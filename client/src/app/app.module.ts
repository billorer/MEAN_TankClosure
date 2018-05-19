import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OptionsComponent } from './components/options/options.component';
import { MenuComponent } from './components/menu/menu.component';
import { GameComponent } from './components/game/game.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { ImagesService } from './services/images.service';
import { SocketioService } from './services/socketio.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';



const appRoutes: Routes = [
    {path:'', component: HomeComponent},
    {path:'register', component: RegisterComponent},
    {path:'login', component: LoginComponent},
    {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
    {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
    {path:'options', component: OptionsComponent, canActivate:[AuthGuard]},
    {path:'menu', component: MenuComponent, canActivate:[AuthGuard]},
    {path:'game', component: GameComponent, canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    OptionsComponent,
    MenuComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [ValidateService, AuthService, AuthGuard, SocketioService, ImagesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
