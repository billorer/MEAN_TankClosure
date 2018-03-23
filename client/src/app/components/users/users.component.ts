// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../user.service';
// import { User } from '../user';
//
// @Component({
//   selector: 'app-users',
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.css'],
//   providers: [UserService]
// })
// export class UsersComponent implements OnInit {
//     users: User[];
//     user: User;
//     first_name:string;
//     last_name:string;
//     phone:string;
//
//     constructor(private userService: UserService) { }
//
//     addUser(){
//         const newUser = {
//             first_name: this.first_name,
//             last_name: this.last_name,
//             phone: this.phone
//         }
//         this.userService.addUser(newUser)
//             .subscribe(user => {
//                 this.users.push(user);
//                 this.getUsers();
//             });
//     }
//
//     deleteUser(id:any){
//         var users = this.users;
//         this.userService.deleteUser(id)
//             .subscribe(data => {
//                 if(data.n==1){
//                     for(let i=0;i<users.length;i++){
//                         if(users[i]._id == id){
//                             users.splice(i,1);
//                         }
//                     }
//                 }
//             });
//     }
//
//     getUsers(){
//         this.userService.getUsers()
//             .subscribe( users => this.users = users );
//         }
//
//     ngOnInit() {
//         this.getUsers();
//     }
// }
