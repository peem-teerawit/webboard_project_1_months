import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit {
  thread: any;
  replies: any[] = [];
  replyContent: string = ''; // Variable for reply content
  isAnonymous: boolean = false; // Variable for anonymity

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getThread(id!).subscribe(
      (data) => {
        this.thread = data;
        this.loadReplies(id!); // Load replies after fetching the thread
      },
      (error) => {
        console.error('Error loading thread detail', error);
      }
    );
  }

  loadReplies(threadId: string) {
    this.apiService.getRepliesByThreadId(threadId).subscribe(
        (data) => {
            this.replies = data; // Assign the replies to the replies property
        },
        (error) => {
            console.error('Error loading replies', error);
        }
  );   
  }
  // Method to create a reply
  createReply() {
    const threadId = this.thread._id; // Assuming thread ID is available
    this.apiService.createReply(threadId, this.replyContent, this.isAnonymous).subscribe(
      (data) => {
        this.replies.push(data); // Add the new reply to the replies list
        this.replyContent = ''; // Clear the input field
      },
      (error) => {
        console.error('Error creating reply', error);
      }
    );
  }

    // Modify the reply display method to show "Anonymous" if reply is anonymous
  getReplyDisplayName(reply: any): string {
    return reply.is_anonymous ? 'Anonymous' : reply.user_name; // Show "Anonymous" if is_anonymous is true
  }


  

}
