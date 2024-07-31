import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http : HttpClient) { }

  // Fun to get the data of one user
  getUser(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/user/${userId}`)

    return data
  }

  // Fun to get the user but by using the id of google
  getUserProvider(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/userProviders/${userId}`)

    return data
  }

  // Fun to register user manully
  registerUser(formData : any): Observable<any> {
    
    return this.http.post(`http://localhost:3000/api/users/register`, formData);
  }

  // Fun to log the user by google
  LoginUserGoogle() {
    window.location.href = "http://localhost:3000/api/users/google"
  }

  // Fun to log the user by discord
  LoginUserDiscord() {
    window.location.href = "http://localhost:3000/api/users/discord"
  }

  // Fun to log the user locally
  loginUserLocally(mail : string, password : string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/users/login`, {mail, password});
  }



  sendContactData(name : string, mail : string, message : string) : Observable<any>{
    console.log(message);
    
    return this.http.post('http://localhost:3000/send-email', {name, mail, message})
  }

}
