import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  threads: any[] = [];
  currentUsername: string | null;

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
      },
      (error) => {
        console.error('Error loading threads', error);
      }
    );
  }

  // Method to format tags
  formatTags(tags: string[]): string {
    return tags.map(tag => `#${tag}`).join(' ');
  }

  // Method to format the created_at timestamp
  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Method to truncate content to 20 words
  truncateContent(content: string): string {
    const englishWords = content.match(/\w+('\w+)?/g) || [];
    const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || [];

    const combinedWords = [...new Set([...englishWords, ...thaiWords])];

    if (combinedWords.length > 20) {
      return combinedWords.slice(0, 20).join(' ') + '...';
    }
    return content;
  }

  // Method to check if the current user can edit the thread
  canEdit(thread: any): boolean {
    return thread.user_name === this.currentUsername;
  }

  // Method to check if the thread should display 'anonymous' instead of the username
  getDisplayedUsername(thread: any): string {
    return thread.is_anonymous ? 'anonymous' : thread.user_name;
  }
}
