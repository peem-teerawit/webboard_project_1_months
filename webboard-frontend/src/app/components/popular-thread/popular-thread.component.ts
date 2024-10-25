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
}
