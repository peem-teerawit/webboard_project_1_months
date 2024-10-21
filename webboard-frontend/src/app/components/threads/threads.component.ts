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

  constructor(private apiService: ApiService) {}

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

  // Method to truncate content to 50 words
  truncateContent(content: string): string {
    const englishWords = content.match(/\w+('\w+)?/g) || []; // Match English words
    const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || []; // Match Thai words

    // Combine both word arrays, ensuring uniqueness
    const combinedWords = [...new Set([...englishWords, ...thaiWords])];

    if (combinedWords.length > 50) {
      return combinedWords.slice(0, 50).join(' ') + '...'; // Join first 50 words and add '...'
    }
    return content; // Return original content if it's 50 words or fewer
  }
}
