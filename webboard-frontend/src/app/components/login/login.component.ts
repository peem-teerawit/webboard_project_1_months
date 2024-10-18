import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.username && this.password) {
      this.apiService.login(this.username, this.password).subscribe(
        (response: any) => {
          // Assuming the response contains the token in the 'token' field
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', this.username); // Store username
          
          // Navigate to the threads page after successful login
          this.router.navigate(['/threads']).then(() => {
            window.location.reload(); // Refresh the page
          });
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
