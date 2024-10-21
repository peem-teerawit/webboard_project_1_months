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
  loading = false; 

  constructor(private router: Router) { }

  // Lifecycle hook to check token and username
  ngOnInit() {
    this.token = localStorage.getItem('token'); 
    this.username = localStorage.getItem('username'); 
  }

  // Method to log out
  async logOut() {
    this.loading = true; 
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.token = null; 
    this.username = null;
    this.closeDropdown();

    // Simulate a delay for the logout process (optional)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate to the thread page after logout
    this.router.navigate(['/threads']); 
    this.loading = false; 
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
