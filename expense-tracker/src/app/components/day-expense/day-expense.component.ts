import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-day-expense',
  templateUrl: './day-expense.component.html',
  styleUrls: ['./day-expense.component.css']
})
export class DayExpenseComponent {
  @Input() day: string = '';
  @Input() expenses: any[] = [];
  @Output() update = new EventEmitter<{ day: string, expenses: any[] }>();

  newExpense = { category: '', amount: 0 };

  addExpense() {
    if (this.newExpense.category && this.newExpense.amount > 0) {
      this.expenses.push({ ...this.newExpense, editing: false });
      this.newExpense = { category: '', amount: 0 };
      this.emitUpdate();
    }
  }

  editExpense(expense: any) {
    expense.editing = true;
  }

  saveExpense(expense: any) {
    expense.editing = false;
    this.emitUpdate();
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
  }
}