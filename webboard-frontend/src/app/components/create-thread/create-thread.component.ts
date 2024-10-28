import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';



@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css'],

})
export class CreateThreadComponent {
  title: string = '';
  content: string = '';
  isAnonymous: boolean = false;
  tagsString: string = ''; 
  tags: string[] = []; 
  expireAt?: Date;
  showPopup: boolean = false;
  popupMessage: string = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
   
  }

  constructor(private apiService: ApiService, private router: Router) {}

  checkTagLimit() {
    this.tags = this.tagsString.split(',').map(tag => tag.trim());
    if (this.tags.length > 5) {
      this.showPopup = true;
      this.popupMessage = 'คุณสามารถเพิ่มแท็กได้สูงสุด 5 แท็กเท่านั้น';
    }
  }

  closePopup() {
    this.showPopup = false;
  }

  createThread() {
    if (this.tags.length > 5) {
      this.showPopup = true;
      this.popupMessage = 'คุณสามารถเพิ่มแท็กได้สูงสุด 5 แท็กเท่านั้น';
      return;
    }

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
