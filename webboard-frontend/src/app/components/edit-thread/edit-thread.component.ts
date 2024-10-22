import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-thread',
  templateUrl: './edit-thread.component.html',
  styleUrls: ['./edit-thread.component.css']
})
export class EditThreadComponent implements OnInit {
  threadId: string | null = null; // Thread ID to edit
  threadData: any = { title: '', content: '', tags: [], is_anonymous: false, expire_at: '' }; // Holds the thread data to be edited

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.threadId = this.route.snapshot.paramMap.get('id'); // Get the thread ID from the route
    this.getThreadDetails();
  }

  // Fetch the thread details to edit
  getThreadDetails(): void {
    if (this.threadId) {
      this.apiService.getThread(this.threadId).subscribe(
        (response: any) => {
          this.threadData = response; // Assign the retrieved thread data to threadData
        },
        (error) => {
          console.error('Error retrieving thread details', error);
        }
      );
    }
  }

  // Update the thread information
  updateThread(): void {
    if (this.threadId) {
      this.apiService.updateThread(this.threadId, this.threadData).subscribe(
        () => {
          console.log('Thread updated successfully');
          this.router.navigate([`/thread-detail/${this.threadId}`]); // Redirect to the thread detail page after successful update
        },
        (error) => {
          console.error('Error updating thread', error);
        }
      );
    }
  }
}
