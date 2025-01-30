import { Component, ViewChild, AfterViewInit } from '@angular/core';
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

export class ExpenseTrackerComponent implements AfterViewInit {
  @ViewChild('displayTabGroup', { static: false }) tabGroup!: MatTabGroup;
  days = Object.keys(Weekdays).map((key:string)=> Weekdays[key as keyof typeof Weekdays])
  weeklyExpenses: { [key: string]: any[] } = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
    Friday: [], Saturday: [], Sunday: []
  };

  ngAfterViewInit() {
    if (!this.tabGroup) {
      console.log('MatTabGroup NOT Initialized...');
    } else {
      console.log('MatTabGroup Initialized successfully!')
    }
  }

  updateWeeklyExpenses($event: DayExpense) {
    this.weeklyExpenses[$event.day] = $event.expenses;
  }

  getDailyTotal(): { [key: string]: number } {
    let dailyTotal: { [key: string]: number } = {};
    Object.keys(this.weeklyExpenses).forEach(day => {
      dailyTotal[day] = this.weeklyExpenses[day].reduce((acc, expense) => acc + expense.amount, 0);
    });
    return dailyTotal;
  }

  calculateWeeklyTotal(): number {
    return Object.values(this.weeklyExpenses)
      .flat()
      .reduce((acc, expense) => acc + expense.amount, 0);
  }
  
  nextTab(index: number) {
    console.log("index: ", index);
    if (index < this.days.length) {
      this.tabGroup.selectedIndex = index + 1;
      console.log(`Moved to next tab: $(this.tabgroup.selectedIndex})`);
    }
  }
  previousTab(index: number) {
    console.log("index: ", index);
    if (index > 0) {
      this.tabGroup.selectedIndex = index - 1;
      console.log(`Moved to previous tab: $(this.tabgroup.selectedIndex})`);
    }
  }
  // previousTab() {
  //   if (this.tabGroup && this.tabGroup.selectedIndex > 0) {
  //     this.tabGroup.selectedIndex -= 1;
  //     console.log(`Switched to tab: ${this.tabGroup.selectedIndex}`);
  //   }
  // }

  // nextTab() {
  //   if (this.tabGroup && this.tabGroup.selectedIndex < this.days.length) {
  //     this.tabGroup.selectedIndex += 1;
  //     console.log(`Switched to tab: ${this.tabGroup.selectedIndex}`);
  //   }
  // }
}