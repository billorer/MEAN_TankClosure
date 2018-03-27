import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onPlayClick() {
      this.router.navigate(['/menu']);
  }

  onOptionsClick(){
      //this.flashMessage.show('Something went wrong!', {cssClass: 'alert-danger', timeout: 3000});
      this.router.navigate(['/options']);
  }
}
