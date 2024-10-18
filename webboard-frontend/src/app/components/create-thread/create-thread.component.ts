import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent {
  title: string = '';
  content: string = '';
  isAnonymous: boolean = false;
  tagsString: string = ''; // Used to handle input as a comma-separated string
  tags: string[] = []; // Will be used to store parsed tags as an array
  expireAt?: Date; // Allow expireAt to be a Date or undefined

  constructor(private apiService: ApiService, private router: Router) {}

  createThread() {
    // Convert comma-separated tags string to an array of trimmed tags
    this.tags = this.tagsString.split(',').map(tag => tag.trim());

    // Create thread using ApiService
    this.apiService.createThread(this.title, this.content, this.isAnonymous, this.tags, this.expireAt).subscribe(
      (response) => {
        console.log('Thread created', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error creating thread', error);
      }
    );
  }
}
