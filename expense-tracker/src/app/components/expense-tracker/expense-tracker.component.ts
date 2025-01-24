import { Component } from '@angular/core';

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  standalone: true,
  styleUrls: ['./expense-tracker.component.css']
})
export class ExpenseTrackerComponent {
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weeklyExpenses: { [key: string]: any[] } = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
    Friday: [], Saturday: [], Sunday: []
  };

  updateWeeklyExpenses(event: { day: string, expenses: any[] }) {
    this.weeklyExpenses[event.day] = event.expenses;
  }

  calculateWeeklyTotal(): number {
    return Object.values(this.weeklyExpenses)
      .flat()
      .reduce((acc, expense) => acc + expense.amount, 0);
  }
}