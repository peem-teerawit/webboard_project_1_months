import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api'; // Adjust this to your backend URL

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
    return this.http.get(`${this.baseUrl}/threads/${id}`);
  }

  createThread(title: string, content: string, isAnonymous: boolean, tags: string[], expireAt?: Date): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/threads`, { title, content, is_anonymous: isAnonymous, tags, expire_at: expireAt }, { headers });
  }

  getRepliesByThreadId(threadId: string) {
    return this.http.get<any[]>(`/api/replies?thread_id=${threadId}`);
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
  




}
