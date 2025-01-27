import { Component } from '@angular/core';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ 
    ExpenseTrackerComponent,
    CommonModule
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-expense-tracker';
}
