import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'webboard-frontend';
  username: string | null = '';
  token: string | null = '';
  dropdownOpen = false;

  constructor(private router: Router) { }

  // Lifecycle hook to check token and username
  ngOnInit() {
    this.token = localStorage.getItem('token'); // Check if token exists
    this.username = localStorage.getItem('username'); // Get username if logged in
  }

  // Method to log out
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.token = null; // Update token and username to null after logout
    this.username = null;
    this.closeDropdown();

    // Navigate to the thread page after logout
    this.router.navigate(['/threads']); // Change '/threads' if needed
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
