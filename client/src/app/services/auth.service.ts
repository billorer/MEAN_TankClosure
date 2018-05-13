import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
    authToken: any;
    user: any;
    options: any;

  constructor(private http: Http) { }

  registerUser(user){
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      return this.http.post(environment.api_url+'/user/register', user, {headers:headers}).map(res => res.json());
  }

  authenticateUser(user){
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      return this.http.post(environment.api_url+'/user/authenticate', user, {headers:headers}).map(res => res.json());
  }

  saveOptions(option){
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      return this.http.put(environment.api_url+'/option/saveOptions', option, {headers:headers}).map(res => res.json());
  }

  getOption(userId){
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.get(environment.api_url+'/option/getOption/'+userId, {headers:headers}).map(res => res.json());
  }

  getProfile(){
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type','application/json');
      return this.http.get(environment.api_url+'/user/profile', {headers:headers}).map(res => res.json());
  }

  loadToken() {
      const token = localStorage.getItem('id_token');
      this.authToken = token;
  }

  storeOptionsData(options){
      localStorage.setItem('option', JSON.stringify(options));
      this.options = options;
  }

  storeUserData(token, user){
      localStorage.setItem('id_token', token);
      localStorage.setItem('user', JSON.stringify(user)); //localStorage cannot store objects
      this.authToken = token;
      this.user = user;
  }

  getUserIdFromLStorage(){
      return JSON.parse(localStorage.getItem('user')).id;
  }

  getUserNameFromLStorage(){
      return JSON.parse(localStorage.getItem('user')).username;
  }

  getOptionsFromLStorage(){
      return JSON.parse(localStorage.getItem('option'));
  }

  loggedIn(){
      return tokenNotExpired('id_token');
  }

  logout(){
      this.authToken = null;
      this.user = null;
      localStorage.clear();
  }

}
