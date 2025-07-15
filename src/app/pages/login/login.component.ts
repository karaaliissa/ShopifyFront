// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone : false,
  template: `
    <div>
      <input [(ngModel)]="username" placeholder="Username">
      <input [(ngModel)]="password" type="password" placeholder="Password">
      <button (click)="login()">Login</button>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('https://shopify-proxy-wlo0.onrender.com/api/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
      localStorage.setItem('jwt_token', res.token);
      this.router.navigate(['/orders']);  // 👈 redirect to protected route
    }, err => {
      alert('Login failed');
    });
  }
}
