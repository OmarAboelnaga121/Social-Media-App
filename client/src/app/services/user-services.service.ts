import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http : HttpClient) { }

  serverUrl: any = "https://jealous-pammi-omarwael-b75cda98.koyeb.app"

  // Fun to get the data of one user
  getUser(userId : string) : Observable<any>{
    let data = this.http.get<any>(`${this.serverUrl}/api/user/${userId}`)

    return data
  }

  getUsers() : Observable<any>{
    let data = this.http.get<any>(`${this.serverUrl}/api/users`)

    return data
  }

  getUserPosts(userId : string) : Observable<any>{
    let data = this.http.get<any>(`${this.serverUrl}/api/user/posts/${userId}`)

    return data
  }

  // Fun to get the user but by using the id of google
  getUserProvider(userId : string) : Observable<any>{
    let data = this.http.get<any>(`${this.serverUrl}/api/userProviders/${userId}`)

    return data
  }

  // Fun to register user manully
  registerUser(formData : any): Observable<any> {
    
    return this.http.post(`${this.serverUrl}/api/users/register`, formData);
  }

  // Fun to log the user by google
  LoginUserGoogle() {
    window.location.href = `${this.serverUrl}/api/users/google`
  }

  // Fun to log the user by discord
  LoginUserDiscord() {
    window.location.href = `${this.serverUrl}/api/users/discord`
  }

  // Fun to log the user locally
  loginUserLocally(mail : string, password : string): Observable<any> {
    return this.http.post(`${this.serverUrl}/api/users/login`, {mail, password});
  }

  sendContactData(name : string, mail : string, message : string) : Observable<any>{    
    return this.http.post(`${this.serverUrl}/send-email`, {name, mail, message})
  }

  addFriend(userId : string, friendUserId : string){
    return this.http.put(`${this.serverUrl}/api/user/addFriend`, {userId, friendUserId})
  }

  deleteFriend(userId : string, friendUserId : string){
    return this.http.put(`${this.serverUrl}/api/user/deleteFriend`, {userId, friendUserId})
  }

  
}
