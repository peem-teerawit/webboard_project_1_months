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
}
