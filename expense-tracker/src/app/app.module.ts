import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';

import { ExpenseTrackerComponent } from './components/expense-tracker/expense-tracker.component';
import { DayExpenseComponent } from './components/day-expense/day-expense.component';

@NgModule({
  declarations: [
    AppComponent,
    //ExpenseTrackerComponent,
    //DayExpenseComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    ExpenseTrackerComponent,
    DayExpenseComponent,
    //ExpenseTrackerComponent,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
