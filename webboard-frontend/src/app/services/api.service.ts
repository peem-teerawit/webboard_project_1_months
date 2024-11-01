import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // User login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { username, password });
  }

  // User registration
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, { username, email, password });
  }

  getThreads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/threads`);
  }

  getThread(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/threads/${id}`, { headers });
  }

  createThread(title: string, content: string, isAnonymous: boolean, tags: string[], expireAt?: Date): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/threads`, { title, content, is_anonymous: isAnonymous, tags, expire_at: expireAt }, { headers });
  }

  getRepliesByThreadId(threadId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/replies?thread_id=${threadId}`);
  }

  createReply(threadId: string, content: string, isAnonymous: boolean): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in the headers
  
    return this.http.post(`${this.baseUrl}/replies`, {
        thread_id: threadId,
        content: content,
        is_anonymous: isAnonymous
    }, { headers }); // Include headers in the request
  }

  getUserThreads(): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.baseUrl}/threads/user/threads`, { headers });
  }

  deleteThread(threadId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in the headers
  
    return this.http.delete(`${this.baseUrl}/threads/${threadId}`, { headers });
  }

  updateThread(threadId: string, threadData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in the headers
    
    return this.http.put(`${this.baseUrl}/threads/${threadId}`, threadData, { headers });
  }
  
  getThreadsByTag(tag: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/threads/tags/${tag}`);
  }

  // Fetch tags summary with counts
  getTagsSummary(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/threads/tags-summary`);
  }

  // Fetch popular threads
  getPopularThreads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/threads/popular-thread`);
  }

  // Like a thread
  likeThread(threadId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in the headers
    return this.http.post(`${this.baseUrl}/threads/${threadId}/like`, {}, { headers });
  }

  // Unlike a thread
  unlikeThread(threadId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in the headers
    return this.http.post(`${this.baseUrl}/threads/${threadId}/unlike`, {}, { headers });
  }

  // Fetch threads liked by the user
  getUserLikedThreads(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Set the token in headers

    return this.http.get<any[]>(`${this.baseUrl}/threads/liked`, { headers }); // Send the GET request with headers
  }

  getReplyCount(threadId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/replies/count/${threadId}`);
  }

  // Fetch log summary
  getLogSummary(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/admin/logs`, { headers });
  }

  // Fetch logs for a specific user
  getUserLogs(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/admin/user/${userId}/logs`, { headers });
  }

  // Fetch all usernames in logs
  getAllUsernamesInLogs(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/admin/get-all-user`, { headers });
  }

  // Fetch popular threads by admin
  getPopularThreadsbyAdmin(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/admin/threads/popular`, { headers });
  }

  // Fetch popular tags by admin
  getPopularTagsbyAdmin(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/admin/threads/popular/tags`, { headers });
  }

}
