import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServicesService {

  constructor(private http : HttpClient) { }

  getPosts() : Observable<any>{
    let data = this.http.get<any>(`http://localhost:3000/api/posts`)

    return data  
  }

  createPost(formData : any) : Observable<any>{
    return this.http.post<any>("http://localhost:3000/api/posts", formData)
  }

  deletePost(id : any) : Observable<any>{
    return this.http.delete<any>(`http://localhost:3000/api/posts/${id}`)
  }

  addLike(id : any) : Observable<any>{
    return this.http.put<any>(`http://localhost:3000/api/posts/addLike/${id}`, {})
  }

  addReportForPost(reportedPostId : string, reporterId : string, reportReason : string) : Observable<any>{
    return this.http.put<any>(`http://localhost:3000/api/posts/addReport/${reportedPostId}`, {reporterId, reportReason})
  }
  
  removeLike(id : any) : Observable<any>{
    return this.http.put<any>(`http://localhost:3000/api/posts/removeLike/${id}`, {})
  }
}
