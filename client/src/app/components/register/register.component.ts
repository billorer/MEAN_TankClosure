import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    first_name: String;
    last_name: String;
    username: String;
    email: String;
    password: String;

    constructor(private validateService: ValidateService,
        private flashMessage: FlashMessagesService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    onRegisterSubmit(){
        const user = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          username: this.username,
          password: this.password
        }

        //Required Fields
        if(!this.validateService.validateRegister(user)){
            this.flashMessage.show('Please fill in all fields!', {cssClass: 'alert-danger', timeout: 3000});
            return false;
        }

        //Validate email
        if(!this.validateService.validateEmail(user.email)){
            this.flashMessage.show('Please use a valid email!', {cssClass: 'alert-danger', timeout: 3000});
            return false;
        }

        //Register user
        this.authService.registerUser(user).subscribe(data => {
            if(data.success){
                this.flashMessage.show('You are now registered and can log in!', {cssClass: 'alert-success', timeout: 3000});
                this.router.navigate(['/login']);
            } else {
                this.flashMessage.show('Something went wrong: '+data.msg, {cssClass: 'alert-danger', timeout: 3000});
                this.router.navigate(['/register']);
            }
        });
    }

    onLoginClick(){
        this.router.navigate(['/login']);
    }

    onBackClick(){
        this.router.navigate(['/']);
    }
}
