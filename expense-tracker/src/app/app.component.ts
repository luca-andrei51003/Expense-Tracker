import { Component, OnInit } from '@angular/core';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [ 
    ExpenseTrackerComponent,
    CommonModule,
    LoginComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isAuthenticated = false;
  title = 'app-expense-tracker';
  ngOnInit(): void {
    this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  }
  handleLogin(success: boolean) {
    if (success) {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    }
  }
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated = false;
  }
}
