import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tag-thread',
  templateUrl: './tag-thread.component.html',
  styleUrls: ['./tag-thread.component.css']
})
export class TagThreadComponent implements OnInit {
  threads: any[] = [];
  tag: string | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the tag from the route parameters
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
      },
      (error) => {
        console.error('Error loading threads by tag', error);
      }
    );
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
