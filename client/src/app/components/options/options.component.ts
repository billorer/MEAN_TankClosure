import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Option } from '../../models/option';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
    private option: any;

  constructor(private validateService: ValidateService,
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router)
  {
      this.option = new Option("","","","","","");
  }

  ngOnInit() {
      this.authService.getOption(this.authService.getUserIdFromLStorage()).subscribe(option => {
          this.option = option.options;
      },
      err => {
          console.log("Error: " + err);
          return false;
      });
  }

  onOptionSubmit(){
      const lOption = this.option;

      //Save option
      this.authService.saveOptions(lOption).subscribe(data => {
          if(data.success){
              this.flashMessage.show('Saved successfully!', {cssClass: 'alert-success', timeout: 3000});
              this.router.navigate(['/dashboard']);
          } else {
              this.flashMessage.show('Something went wrong!', {cssClass: 'alert-danger', timeout: 3000});
              this.router.navigate(['/options']);
          }
      });
  }

  onBackClick(){
      this.router.navigate(['/dashboard']);
  }

}
