import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-popular-thread',
  templateUrl: './popular-thread.component.html',
  styleUrls: ['./popular-thread.component.css']
})
export class PopularThreadComponent implements OnInit {
  popularThreads: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPopularThreads();
  }

  loadPopularThreads(): void {
    this.apiService.getPopularThreads().subscribe(
      (threads) => {
        this.popularThreads = threads;
      },
      (error) => {
        console.error('Error loading popular threads', error);
      }
    );
  }

  decodeHtml(html: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }

  stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  getLimitedContent(content: string): string {
    // Strip HTML tags
    const strippedContent = this.stripHtmlTags(content);
    // Decode HTML entities
    const decodedContent = this.decodeHtml(strippedContent);
    // Split into words (using whitespace)
    const words = decodedContent.split(/\s+/);
    // Limit to 20 words
    const limitedWords = words.slice(0, 20);
    // Join back into a string and return
    return limitedWords.join(' ') + (limitedWords.length === 20 ? '...' : '');
  }
}
