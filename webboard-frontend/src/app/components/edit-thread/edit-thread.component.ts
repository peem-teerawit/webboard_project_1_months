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
  threadData: any = { 
    title: '', 
    content: '', 
    tags: [], 
    is_anonymous: false, 
    expire_at: null // Initialize as null or set to a default date value
  }; // Holds the thread data to be edited

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
          // Ensure expire_at is formatted correctly
          if (this.threadData.expire_at) {
            this.threadData.expire_at = this.formatDate(this.threadData.expire_at);
          }
        },
        (error) => {
          console.error('Error retrieving thread details', error);
        }
      );
    }
  }

  // Function to format the date to 'yyyy-MM-ddThh:mm'
  formatDate(date: string): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`; // Format as 'yyyy-MM-ddThh:mm'
  }

  // Update the thread information
  updateThread(): void {
    if (this.threadId) {
      // Check if 'tags' is a string and needs to be split into an array
      if (typeof this.threadData.tags === 'string') {
        this.threadData.tags = this.threadData.tags.split(',').map((tag: string) => tag.trim());
      }
  
      console.log(this.threadData); // Log the data to check if it's correctly capturing the fields
      this.apiService.updateThread(this.threadId, this.threadData).subscribe(
        () => {
          console.log('Thread updated successfully');
          this.router.navigate([`/thread-detail/${this.threadId}`]);
        },
        (error) => {
          console.error('Error updating thread', error);
        }
      );
    }
  }

}
