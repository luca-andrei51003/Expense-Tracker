import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';

@Component({
  selector: 'app-root',
  imports: [ ExpenseTrackerComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app-expense-tracker';
}
