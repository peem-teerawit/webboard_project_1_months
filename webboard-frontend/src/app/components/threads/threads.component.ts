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
        // Initialize threads with actual like counts from backend
        this.threads = data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).map(thread => ({
          ...thread,
          isLiked: false // Initialize isLiked to false; likes count from backend
        }));

        this.loadLikedThreads(); // Load liked threads on init
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
    // Check if the user has already liked the thread
    if (thread.isLiked) {
      // User is unliking the thread
      thread.likes--;
      thread.isLiked = false;

      // Optionally, send a request to the backend to remove the like
      this.apiService.unlikeThread(thread._id).subscribe(
        () => console.log('Thread unliked'),
        (error) => console.error('Error unliking thread', error)
      );
    } else {
      // User is liking the thread
      thread.likes++;
      thread.isLiked = true;

      // Send a request to the backend to like the thread
      this.apiService.likeThread(thread._id).subscribe(
        () => console.log('Thread liked'),
        (error) => console.error('Error liking thread', error)
      );
    }
    this.updateLocalStorage(); // Update local storage after toggling like
  }

  updateLocalStorage(): void {
    const likedThreads = this.threads.map(thread => ({
      id: thread._id,
      isLiked: thread.isLiked,
      likes: thread.likes
    }));

    console.log('Saving liked threads to localStorage:', likedThreads);
    localStorage.setItem('likedThreads', JSON.stringify(likedThreads));
  }

  loadLikedThreads(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.apiService.getUserLikedThreads().subscribe(
        (likedThreads) => {
          // Update isLiked status for each thread based on liked threads
          this.threads.forEach(thread => {
            const likedThread = likedThreads.find((t: any) => t._id === thread._id);
            if (likedThread) {
              thread.isLiked = true;
              thread.likes = likedThread.likes; // Use the like count from liked threads if available
            }
          });
        },
        (error) => {
          console.error('Error loading liked threads', error);
        }
      );
    } else {
      // No token means user is logged out, so only reset isLiked flag, not likes count
      this.threads.forEach(thread => {
        thread.isLiked = false;
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
