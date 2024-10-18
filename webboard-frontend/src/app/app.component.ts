import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webboard-frontend';
  
  username: string | null = '';
  dropdownOpen = false; 

  constructor() {
    this.username = localStorage.getItem('username');
  }

  // Method to log out
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.username = null; 
    this.closeDropdown(); 
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
