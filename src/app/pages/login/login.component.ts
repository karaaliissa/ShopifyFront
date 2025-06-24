// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('https://shopify-proxy-wlo0.onrender.com/login', {
      username: this.username,
      password: this.password
    }).subscribe(res => {
      localStorage.setItem('jwt_token', res.token);
      alert('Logged in!');
    }, err => {
      alert('Login failed');
    });
  }
}
