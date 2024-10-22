import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  threads: any[] = []; // Holds the threads data
  currentUsername: string | null; // Current logged-in user's username

  constructor(private apiService: ApiService) {
    // Get the username from local storage
    this.currentUsername = localStorage.getItem('username'); // Adjust the key as needed
  }

  ngOnInit() {
    this.loadThreads(); // Load threads when component initializes
  }

  // Load the list of threads from the API
  loadThreads() {
    this.apiService.getThreads().subscribe(
      (data) => {
        this.threads = data; // Assign the fetched data to the threads array
      },
      (error) => {
        console.error('Error loading threads', error); // Handle error if thread loading fails
      }
    );
  }

  // Method to format tags (e.g., #tag1 #tag2)
  formatTags(tags: string[]): string {
    return tags.map(tag => `#${tag}`).join(' '); // Format each tag with a '#' prefix and join them with spaces
  }

  // Method to format the created_at timestamp into a relative time (e.g., "2 hours ago")
  formatCreatedAt(createdAt: string): string {
    const date = new Date(createdAt); // Convert the created_at string to a Date object
    return formatDistanceToNow(date, { addSuffix: true }); // Format as relative time using date-fns
  }

  // Method to truncate thread content to 50 words (supports both English and Thai)
  truncateContent(content: string): string {
    const englishWords = content.match(/\w+('\w+)?/g) || []; // Match English words
    const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || []; // Match Thai words

    // Combine both English and Thai words into a single array
    const combinedWords = [...new Set([...englishWords, ...thaiWords])];

    if (combinedWords.length > 50) {
      return combinedWords.slice(0, 50).join(' ') + '...'; // Limit to 50 words and add ellipsis
    }
    return content; // Return original content if fewer than 50 words
  }

  canEdit(thread: any): boolean {
    return thread.user_name === this.currentUsername; 
  }
}
