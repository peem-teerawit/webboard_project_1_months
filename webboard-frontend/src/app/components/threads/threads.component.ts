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

  formatTags(tags: string[]): string {
    return tags.map(tag => `#${tag}`).join(' ');
  }

  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
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
    const englishWords = content.match(/\w+('\w+)?/g) || [];
    const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || [];

    const combinedWords = [...new Set([...englishWords, ...thaiWords])];

    if (combinedWords.length > 20) {
      return combinedWords.slice(0, 20).join(' ') + '...';
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
