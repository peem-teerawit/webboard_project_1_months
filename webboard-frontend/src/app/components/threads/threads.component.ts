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
}
