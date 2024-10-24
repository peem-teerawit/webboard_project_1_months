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
  threadCount: number = 0; // Add a property for thread count
  
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
  }

  loadThreadsByTag(tag: string): void {
    this.apiService.getThreadsByTag(tag).subscribe(
      (data) => {
        this.threads = data.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.threadCount = this.threads.length; // Set thread count based on the retrieved threads
      },
      (error) => {
        console.error('Error loading threads by tag', error);
      }
    );
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
