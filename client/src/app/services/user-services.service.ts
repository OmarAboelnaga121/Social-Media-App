import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http : HttpClient) { }

  getUser(userId : string) : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/users/${userId}`)

    return data
  }

  checkUser(): Observable<any> {
    return this.http.get(`http://localhost:3000/api/auth-status`);
  }
}
