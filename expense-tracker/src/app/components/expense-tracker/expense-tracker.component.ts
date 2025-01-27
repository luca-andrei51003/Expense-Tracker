import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { DayExpense } from '../../shared/models/day-expense-interface';
import { CommonModule } from '@angular/common';
import { DayExpenseComponent } from '../day-expense/day-expense.component';
import { Weekdays } from '../../shared/models/weekdays-enum';

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  standalone: true,
  imports: [ MatTab, CommonModule, MatTabGroup, DayExpenseComponent ],
  styleUrls: ['./expense-tracker.component.css']
})

export class ExpenseTrackerComponent {
  days = Object.keys(Weekdays).map((key:string)=> Weekdays[key as keyof typeof Weekdays])
  weeklyExpenses: { [key: string]: any[] } = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
    Friday: [], Saturday: [], Sunday: []
  };

  updateWeeklyExpenses($event: DayExpense) {
    this.weeklyExpenses[$event.day] = $event.expenses;
  }

  calculateWeeklyTotal(): number {
    return Object.values(this.weeklyExpenses)
      .flat()
      .reduce((acc, expense) => acc + expense.amount, 0);
  }
}