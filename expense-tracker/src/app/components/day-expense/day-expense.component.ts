import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DayExpense } from '../../shared/models/day-expense-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import exp from 'constants';

@Component({
  selector: 'app-day-expense',
  imports: [ CommonModule, FormsModule ],
  standalone: true,
  templateUrl: './day-expense.component.html',
  styleUrls: ['./day-expense.component.css']
})
export class DayExpenseComponent {
  @Input() day: string = '';
  @Input() expenses: any[] = [];
  @Output() update = new EventEmitter<DayExpense>();

  newExpense = { category: '', amount: 0 };

  addExpense() {
    if (this.newExpense.category && this.newExpense.amount > 0) {
      this.expenses.push({ ...this.newExpense, editing: false });
      this.newExpense = { category: '', amount: 0 };
      this.emitUpdate();
    }
  }

  editExpense(expense: any) {
    this.expenses?.forEach(element => {
      if (element.editing == true) {
        element.editing = false;
      }
    });
    expense.editing = true;
    let initialValue = expense.amount;
    console.log(this.expenses);
  }

  saveExpense(expense: any) {
    expense.editing = false;
    this.emitUpdate();
  }

  cancelEditing(expense: any){
    expense.editing = false;
  }

  deleteExpense(index: number) {
    this.expenses.splice(index, 1);
    this.emitUpdate();
  }

  calculateDailyTotal(): number {
    return this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
  }

  private emitUpdate() {
    this.update.emit({ day: this.day, expenses: this.expenses });
    console.log({ day: this.day, expenses: this.expenses });
    
  }
}