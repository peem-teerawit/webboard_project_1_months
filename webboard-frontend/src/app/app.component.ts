import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webboard-frontend';
  
  // Property to hold the username
  username: string | null = '';

  constructor() {
    // Get the username from localStorage
    this.username = localStorage.getItem('username');
  }

  // Method to log out
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.username = null; // Reset username
  }
}
