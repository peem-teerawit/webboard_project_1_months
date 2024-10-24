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
  errorMessage: string = '';
  isLoading: boolean = false; 

  constructor(private apiService: ApiService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = ''; 
    if (this.username && this.password) {
      this.isLoading = true; 
      this.apiService.login(this.username, this.password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', this.username);
          // localStorage.setItem('userId', response.userId);
          localStorage.setItem('role', response.role);
          this.router.navigate(['/threads']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.isLoading = false; 
          if (error.status === 401 || error.status === 404) {
            this.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'; 
          } else {
            this.errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'; 
          }
        },
        () => {
          this.isLoading = false; 
        }
      );
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
