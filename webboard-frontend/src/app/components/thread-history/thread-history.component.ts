import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'; // Make sure to use the correct path for your ApiService

@Component({
  selector: 'app-thread-history',
  templateUrl: './thread-history.component.html',
  styleUrls: ['./thread-history.component.css']
})
export class ThreadHistoryComponent implements OnInit {
  userThreads: any[] = []; // Holds the threads posted by the user
  username: string | null = ''; // Username from localStorage

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username'); // Retrieve the username from localStorage

    if (this.username) {
      this.getUserThreads();
    }
  }

  // Fetch threads posted by the logged-in user
  getUserThreads(): void {
    this.apiService.getUserThreads().subscribe(
      (response: any) => {
        this.userThreads = response; // Assign the retrieved threads to userThreads
      },
      (error) => {
        console.error('Error retrieving user threads', error);
      }
    );
  }

  // Delete a thread
  deleteThread(threadId: string): void {
    if (confirm('Are you sure you want to delete this thread?')) {
      this.apiService.deleteThread(threadId).subscribe(
        () => {
          // Remove the deleted thread from the userThreads array
          this.userThreads = this.userThreads.filter(thread => thread._id !== threadId);
          console.log('Thread deleted successfully');
        },
        (error) => {
          console.error('Error deleting thread', error);
        }
      );
    }
  }

  // Method to truncate content to 20 words
  // truncateContent(content: string): string {
  //   const englishWords = content.match(/\w+('\w+)?/g) || [];
  //   const thaiWords = content.match(/[\u0E00-\u0E7F]+/g) || [];

  //   const combinedWords = [...new Set([...englishWords, ...thaiWords])];

  //   if (combinedWords.length > 20) {
  //     return combinedWords.slice(0, 20).join(' ') + '...';
  //   }
  //   return content;
  // }

  truncateContent(content: string): string {
    const maxLength = 100;

    // Remove HTML tags
    let plainText = content.replace(/<[^>]*>/g, '');

    // Replace HTML entities like &#160; with a space
    plainText = plainText.replace(/&#160;/g, ' ');

    // Truncate the plain text if it exceeds max length
    if (plainText.length > maxLength) {
        return plainText.substring(0, maxLength) + '...';
    }
    return plainText;
  }
}
