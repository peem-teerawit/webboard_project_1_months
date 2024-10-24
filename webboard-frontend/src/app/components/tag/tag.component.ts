import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service'; // Adjust the path as per your folder structure

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  tagsWithCounts: any[] = []; // Array to hold tag data

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTagsSummary();
  }

  getTagsSummary(): void {
    this.apiService.getTagsSummary().subscribe(
      (data) => {
        this.tagsWithCounts = data;
      },
      (error) => {
        console.error('Error fetching tags summary:', error);
      }
    );
  }
}
