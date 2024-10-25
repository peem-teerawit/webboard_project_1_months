import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { format } from 'date-fns';

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
  recognition: any; 
  isListening: boolean = false; 

  constructor(private route: ActivatedRoute, private apiService: ApiService, private zone: NgZone) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getThread(id!).subscribe(
      (data) => {
        this.thread = data;
        this.loadReplies(id!);
      },
      (error) => {
        console.error('Error loading thread detail', error);
      }
    );

    // Initialize SpeechRecognition API
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'th-TH';
    this.recognition.continuous = true; 
    this.recognition.interimResults = true; 

    // Handle speech result
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          this.zone.run(() => {
            this.replyContent += event.results[i][0].transcript + ' ';
          });
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
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
        this.replies = data; 
      },
      (error) => {
        console.error('Error loading replies', error);
      }
    );
  }

  // Method to create a reply
  createReply() {
    const threadId = this.thread._id; 
    this.apiService.createReply(threadId, this.replyContent, this.isAnonymous).subscribe(
      (data) => {
        this.replies.push(data);
        this.replyContent = ''; 
      },
      (error) => {
        console.error('Error creating reply', error);
      }
    );
  }

  // Modify the reply display method to show "Anonymous" if reply is anonymous
  getReplyDisplayName(reply: any): string {
    return reply.is_anonymous ? 'Anonymous' : reply.user_name; 
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

  // New method to format expireAt
  formatExpireAt(expireAt: string | null): string {
    if (expireAt) {
      const date = new Date(expireAt);
      return `Expires on: ${format(date, 'MMMM dd, yyyy HH:mm')}`;
    }
    return '';
  }

  
}
