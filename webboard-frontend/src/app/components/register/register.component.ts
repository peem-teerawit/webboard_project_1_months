import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');

      return;
    }

    this.apiService.register(this.username, this.email, this.password).subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
