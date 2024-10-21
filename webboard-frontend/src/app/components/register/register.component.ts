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
  
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  // Error messages for form validation
  errorMessages = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  };

  // Loading state
  isLoading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister(): void {
    this.clearErrorMessages();
    
    // Validate inputs
    if (!this.username) {
      this.errorMessages.username = '* กรุณากรอกชื่อ';
    }
    if (!this.email) {
      this.errorMessages.email = '* กรุณากรอกอีเมล';
    } else if (!this.isValidEmail(this.email)) {
      this.errorMessages.email = '* กรุณากรอกอีเมลที่ถูกต้อง';
    }
    if (!this.password) {
      this.errorMessages.password = '* กรุณากรอกรหัสผ่าน';
    }
    if (!this.confirmPassword) {
      this.errorMessages.confirmPassword = '* กรุณายืนยันรหัสผ่าน';
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessages.general = 'รหัสผ่านไม่ตรงกัน';
      return;
    }

    if (this.hasErrors()) {
      return;
    }

    // Set loading state to true
    this.isLoading = true;

    this.apiService.register(this.username, this.email, this.password).subscribe(
      () => {
        alert('ลงทะเบียนสำเร็จ'); 
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        this.errorMessages.general = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      },
      () => {
        // Reset loading state when the request completes
        this.isLoading = false;
      }
    );
  }

  clearErrorMessages(): void {
    this.errorMessages = { username: '', email: '', password: '', confirmPassword: '', general: '' };
  }

  hasErrors(): boolean {
    return Object.values(this.errorMessages).some(msg => msg !== '');
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
