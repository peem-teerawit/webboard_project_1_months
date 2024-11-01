import { Component, OnInit } from '@angular/core'; 
import { Router, NavigationEnd } from '@angular/router';

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
  isAdmin = false; // New variable to store admin status
  isDashboardPage = false; 

  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDashboardPage = event.url === '/admin/dashboard';
      }
    });
  }

  ngOnInit() {
    this.token = localStorage.getItem('token'); 
    this.username = localStorage.getItem('username'); 
    const role = localStorage.getItem('role'); // Retrieve role from local storage
    this.isAdmin = role === 'admin'; // Set isAdmin to true if role is 'admin'
  }

  async logOut() {
    this.loading = true; 
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.token = null; 
    this.username = null;
    this.closeDropdown();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.router.navigate(['/threads']).then(() => {
      window.location.reload();
    });
    this.loading = false; 
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
}
