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
    // Get the username from local storage
    this.currentUsername = localStorage.getItem('username'); // Adjust the key as needed
  }

  ngOnInit() {
    this.loadThreads();
  }

  loadThreads() {
    this.apiService.getThreads().subscribe(
      (data) => {
        this.threads = data;
      },
      (error) => {
        console.error('Error loading threads', error);
      }
    );
  }

  // Method to format tags
  formatTags(tags: string[]): string {
    return tags.map(tag => `#${tag}`).join(' '); // Format tags as #tag1 #tag2
  }

  // Method to format the created_at timestamp
  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt); // Convert string to Date object
    return formatDistanceToNow(date, { addSuffix: true }); // Format to relative time
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

  // Method to check if the current user can edit the thread
  canEdit(thread: any): boolean {
    return thread.user_name === this.currentUsername; // Compare thread username with current username
  }
}
