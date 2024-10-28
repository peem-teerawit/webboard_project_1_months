import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { formatDistanceToNow, format } from 'date-fns';

@Component({
  selector: 'app-tag-thread',
  templateUrl: './tag-thread.component.html',
  styleUrls: ['./tag-thread.component.css']
})
export class TagThreadComponent implements OnInit {
  threads: any[] = [];
  tag: string | null = null;
  currentUsername: string | null;
  threadCount: number = 0; 
  likedThreads: Set<number> = new Set(); 

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.currentUsername = localStorage.getItem('username');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tags');
      if (this.tag) {
        this.loadThreadsByTag(this.tag);
      }
    });
    this.loadLikedThreads(); 
  }

  loadThreadsByTag(tag: string): void {
    this.apiService.getThreadsByTag(tag).subscribe(
      (data) => {
        this.threads = data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        // Load reply counts for each thread
        this.threads.forEach(thread => {
          this.apiService.getRepliesByThreadId(thread._id).subscribe(
            (replies) => {
              thread.comments = replies.length; // กำหนดจำนวนคอมเม้นต์
            },
            error => {
              console.error('Error loading replies:', error);
              thread.comments = 0;
            }
          );
        });
  
        this.threadCount = this.threads.length;
      },
      (error) => {
        console.error('Error loading threads by tag:', error);
      }
    );
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

  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  formatExpireAt(expireAt: string | null): string {
    if (expireAt) {
      const date = new Date(expireAt);
      return `Expires on: ${format(date, 'MMMM dd, yyyy HH:mm')}`;
    }
    return '';
  }

  canEdit(thread: any): boolean {
    return thread.user_name === this.currentUsername; 
  }

  getDisplayedUsername(thread: any): string {
    return thread.is_anonymous ? 'anonymous' : thread.user_name; 
  }

  truncateContent(content: string): string {
    const englishWords = content.match(/\w+('\w+)?/g) || [];
    const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || [];
    const combinedWords = [...new Set([...englishWords, ...thaiWords])];

    if (combinedWords.length > 20) {
      return combinedWords.slice(0, 20).join(' ') + '...'; 
    }
    return content;
  }
}
