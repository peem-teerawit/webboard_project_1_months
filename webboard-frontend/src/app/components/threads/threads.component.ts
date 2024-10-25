import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { formatDistanceToNow, format } from 'date-fns';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  threads: any[] = [];
  currentUsername: string | null;
  trendingTags: string[] = [];

  constructor(private apiService: ApiService) {
    this.currentUsername = localStorage.getItem('username');
  }

  ngOnInit() {
    this.loadThreads();
  }

  loadThreads() {
    this.apiService.getThreads().subscribe(
      (data) => {
        this.threads = data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.loadLikedThreads(); // เรียกใช้ฟังก์ชันนี้ที่นี่
        this.extractTrendingTags();  
      },
      (error) => {
        console.error('Error loading threads', error);
      }
    );
  }  

  extractTrendingTags() {
    const tagCount: { [key: string]: number } = {};

    // Count occurrences of each tag
    this.threads.forEach(thread => {
      thread.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // Sort tags by their count and take the top 7
    this.trendingTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])  
      .slice(0, 7)                  
      .map(entry => entry[0]);       
  }

  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  toggleLike(thread: any): void {
    // Initialize likes if not present
    if (typeof thread.likes !== 'number') {
      thread.likes = 0; 
    }

    // Toggle like status
    thread.isLiked = !thread.isLiked; 

    if (thread.isLiked) {
      thread.likes++; 
    } else {
      thread.likes--; 
    }

    // Update the local storage with the liked threads
    this.updateLocalStorage();
  }

  updateLocalStorage(): void {
    const likedThreads = this.threads.map(thread => ({
      id: thread._id,
      isLiked: thread.isLiked,
      likes: thread.likes
    }));

    localStorage.setItem('likedThreads', JSON.stringify(likedThreads));
  }

  loadLikedThreads(): void {
    const likedThreads = localStorage.getItem('likedThreads');

    if (likedThreads) {
      const parsedThreads = JSON.parse(likedThreads);

      // Update isLiked status and likes count for each thread
      this.threads.forEach(thread => {
        const likedThread = parsedThreads.find((t: any) => t.id === thread._id);
        if (likedThread) {
          thread.isLiked = likedThread.isLiked;
          thread.likes = likedThread.likes; 
        } else {
          thread.isLiked = false;
          thread.likes = 0;
        }
      });
    }
  }

  // Method to format the expire_at timestamp
  formatExpireAt(expireAt: string | null): string {
    if (expireAt) {
      const date = new Date(expireAt);
      return `Expires on: ${format(date, 'MMMM dd, yyyy HH:mm')}`;
    }
    return '';
  }

  truncateContent(content: string): string {
    const maxLength = 100;

    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...'; 
    }
    return content; 
  }

  canEdit(thread: any): boolean {
    return thread.user_name === this.currentUsername;
  }

  getDisplayedUsername(thread: any): string {
    return thread.is_anonymous ? 'anonymous' : thread.user_name;
  }
}
