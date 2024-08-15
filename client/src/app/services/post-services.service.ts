import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServicesService {

  constructor(private http : HttpClient) { }

  serverUrl: any = "https://jealous-pammi-omarwael-b75cda98.koyeb.app"
  // serverUrl: any = "http://localhost:8001"


  // fun to get the posts from backend
  getPosts() : Observable<any>{
    let data = this.http.get<any>(`${this.serverUrl}/api/posts`)

    return data  
  }

  // fun to create post by backend
  createPost(formData : any) : Observable<any>{
    return this.http.post<any>(`${this.serverUrl}/api/posts`, formData)
  }

  // fun to delete post by backend
  deletePost(id : any) : Observable<any>{
    return this.http.delete<any>(`${this.serverUrl}/api/posts/${id}`)
  }

  // fun to add or remove like from backend
  addLike(id : string, userId : string) : Observable<any>{
    return this.http.put<any>(`${this.serverUrl}/api/posts/addLike/${id}`, {userId})
  }

  // fun to add report for post
  addReportForPost(reportedPostId : string, reporterId : string, reportReason : string) : Observable<any>{
    return this.http.put<any>(`${this.serverUrl}/api/posts/addReport/${reportedPostId}`, {reporterId, reportReason})
  }

  addCommentForPost(commentPostId : string, commenterId : string, commentText : string) : Observable<any>{
    return this.http.put<any>(`${this.serverUrl}/api/posts/addComment/${commentPostId}`, {commenterId, commentText})
  }
}
