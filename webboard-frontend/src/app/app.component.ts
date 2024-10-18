import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webboard-frontend';

  username: string | null = '';
  dropdownOpen = false;

  constructor(private router: Router) { // Inject Router in the constructor
    this.username = localStorage.getItem('username');
  }

  // Method to log out
  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.username = null;
    this.closeDropdown();

    // Navigate to the thread page after logout
    this.router.navigate(['/threads']); // Change '/threads' to the appropriate path if needed
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
