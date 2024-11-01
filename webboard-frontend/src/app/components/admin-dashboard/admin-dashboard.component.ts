import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary: any = {
    today: {
      totalViews: 0,
      boardsViewed: 0,
      boardsCreated: 0,
      userViews: [] // Array of usernames
    },
    month: {
      totalViews: 0,
      boardsViewed: 0,
      boardsCreated: 0
    },
    year: {
      totalViews: 0,
      boardsViewed: 0,
      boardsCreated: 0
    },
    mostPopularPosts: [], // Add for popular posts
    mostPopularTags: []   // Add for popular tags
  };

  popularThreads: any[] = []; // New property to hold popular threads
  popularTags: any[] = []; // New property to hold popular tags
  logs: any[] = []; // To hold log data
  lastUpdatedDate: Date = new Date();
  loading: boolean = false;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadStats();
    setInterval(() => {
      this.loadStats();
    }, 300000); // Refresh every 5 minutes
  }

  truncateContent(content: string, limit: number): string {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + '...'; // Add ... at the end if content is too long
  }

  loadStats() {
    this.loading = true;
    this.error = null;

    // Fetch the log summary from the API
    this.apiService.getLogSummary().subscribe({
      next: (data) => {
        this.summary = data.summary || this.summary; // Ensure summary is initialized
        this.summary.mostPopularPosts = data.mostPopularPosts || [];
        this.summary.mostPopularTags = data.mostPopularTags || [];
        this.logs = data.logs || []; // Load logs from API
        this.lastUpdatedDate = new Date();

        // Sort logs by timestamp to show recent logs
        this.sortLogsByTimestamp();

        // Fetch popular threads and tags
        this.apiService.getPopularThreadsbyAdmin().subscribe({
          next: (threads) => {
            this.popularThreads = threads || []; // Update popular threads
          },
          error: (error) => {
            console.error('Error fetching popular threads:', error);
            this.error = 'ไม่สามารถโหลดข้อมูลกระทู้ยอดนิยมได้'; // Thai error message
          }
        });

        this.apiService.getPopularTagsbyAdmin().subscribe({
          next: (tags) => {
            this.popularTags = tags || []; // Update popular tags
          },
          error: (error) => {
            console.error('Error fetching popular tags:', error);
            this.error = 'ไม่สามารถโหลดข้อมูลแท็กยอดนิยมได้'; // Thai error message
          }
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard stats:', error);
        this.error = 'ไม่สามารถโหลดข้อมูลสถิติได้'; // Thai error message
        this.loading = false;
      }
    });
  }

  refreshStats(): void {
    this.loadStats();
  }

  // Sort logs by timestamp to show the most recent logs
  private sortLogsByTimestamp() {
    this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  get paginatedLogs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.logs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages() {
    return Math.ceil(this.logs.length / this.itemsPerPage);
  }
}
