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
    }
  };
  logs: any[] = []; // To hold log data
  lastUpdatedDate: Date = new Date();
  loading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadStats();
    setInterval(() => {
      this.loadStats();
    }, 300000); // Refresh every 5 minutes
  }

  loadStats() {
    this.loading = true;
    this.error = null;

    // Fetch the log summary from the API
    this.apiService.getLogSummary().subscribe({
      next: (data) => {
        this.summary = data.summary || this.summary; // Ensure summary is initialized
        this.logs = data.logs || [];
        this.lastUpdatedDate = new Date();
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
}
