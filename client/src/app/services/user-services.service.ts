import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http : HttpClient) { }

  getUser(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/user/${userId}`)

    return data
  }

  registerUser(displayName : string, mail : string, password : string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/users/register`, {displayName, mail, password});
  }
  loginUserDiscord(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/users/discord`, { withCredentials: true });
  }
  loginUserGoogle(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/users/google`, { withCredentials: true });
  }

  loginUserLocally(mail : string, password : string): Observable<any> {
    return this.http.post(`http://localhost:3000/api/users/login`, {mail, password});
  }

}
