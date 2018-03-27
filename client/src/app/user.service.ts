// import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
// import { User } from './user';
// import 'rxjs/add/operator/map';
//
// @Injectable()
// export class UserService {
//
//   constructor(private http: Http) { }
//
//   //retriveing UserService
//   getUsers(){
//     return this.http.get('http://localhost:3000/api/users')
//     .map(res=>res.json());
//   }
//
//   //add new user
//   addUser(newUser){
//     var headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     return this.http.post('http://localhost:3000/api/user', newUser, {headers: headers})
//         .map(res=>res.json());
//     }
//     //delete method
//     deleteUser(id){
//         return this.http.delete('http://localhost:3000/api/user/'+id)
//             .map(res=>res.json());
//     }
// }
