import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-thread-detail',
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.css']
})
export class ThreadDetailComponent implements OnInit, OnDestroy {
  thread: any;
  replies: any[] = [];
  replyContent: string = '';
  isAnonymous: boolean = false;
  recognition: any; // SpeechRecognition object
  isListening: boolean = false; // To track whether the recognition is active

  constructor(private route: ActivatedRoute, private apiService: ApiService, private zone: NgZone) {}

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

    // Initialize SpeechRecognition API
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'th-TH'; // Set recognition language to Thai
    this.recognition.continuous = true; // Keep recognizing speech continuously
    this.recognition.interimResults = true; // Get interim results

    // Handle speech result
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.zone.run(() => {
            this.replyContent += event.results[i][0].transcript + ' '; // Add space for separation
          });
        } else {
          interimTranscript += event.results[i][0].transcript; // Add interim result
        }
      }
      // Optional: Log interim results to the console for debugging
      console.log('Interim transcript:', interimTranscript);
    };

    // Handle recognition errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  ngOnDestroy() {
    // Stop speech recognition when the component is destroyed
    if (this.recognition) {
      this.recognition.stop();
    }
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

  // Start or stop speech recognition
  toggleSpeechRecognition() {
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
    this.isListening = !this.isListening;
  }
}
