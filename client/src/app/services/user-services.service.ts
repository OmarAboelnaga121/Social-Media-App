import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http : HttpClient) { }

  getUser(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/user/${userId}`)

    return data
  }
  getUserProvider(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/userProviders/${userId}`)

    return data
  }

  registerUser(formData : any): Observable<any> {
    
    return this.http.post(`http://localhost:3000/api/users/register`, formData);
  }
  
  LoginUserGoogle() {
    window.location.href = "http://localhost:3000/api/users/google"
  }

  LoginUserDiscord() {
    window.location.href = "http://localhost:3000/api/users/discord"
  }

  loginUserLocally(mail : string, password : string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/users/login`, {mail, password});
  }



  sendContactData(name : string, mail : string, message : string) : Observable<any>{
    console.log(message);
    
    return this.http.post('http://localhost:3000/send-email', {name, mail, message})
  }

}
