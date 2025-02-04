import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { DayExpense } from '../../shared/models/day-expense-interface';
import { CommonModule } from '@angular/common';
import { DayExpenseComponent } from '../day-expense/day-expense.component';
import { Weekdays } from '../../shared/models/weekdays-enum';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LoginComponent } from '../../login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-tracker',
  templateUrl: './expense-tracker.component.html',
  standalone: true,
  imports: [ MatTab, CommonModule, MatTabGroup, ReactiveFormsModule, DayExpenseComponent, LoginComponent ],
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
    const now = new Date();
    const formattedTimestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} <@> ${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;

    if (!this.tabGroup) {
      console.log(`[${formattedTimestamp}] MatTabGroup NOT Initialized...`);
    } else {
      console.log(`[${formattedTimestamp}] MatTabGroup Initialized successfully!`);
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

  exportToExcel() {
    const today = new Date();
    const currentDay = today.getDay();
  
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
  
    const formatDate = (date: Date) =>
      `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const startDate = formatDate(monday);
    const endDate = formatDate(sunday);

    const data: any[] = [];
    const merges: XLSX.Range[] = [];
    let rowIndex = 1;
    const borderStyle = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
      left: { style: 'thick' },
      right: { style: 'thick' },
    };
    const cellStyles: any = {};
  
    this.days.forEach((day) => {
      const expenses = this.weeklyExpenses[day];
      const startRow = rowIndex;

      if (expenses.length > 0) {
        data.push({ Day: day.toUpperCase(), Category: expenses[0].category, Amount: expenses[0].amount });
      } else {
        data.push({ Day: day.toUpperCase(), Category: '', Amount: '' });
      }
  
      for (let i = 1; i < expenses.length; i++) {
        data.push({ Day: '', Category: expenses[i].category, Amount: expenses[i].amount });
        rowIndex++;
      }

      if (expenses.length > 0) {
        merges.push({ s: { r: startRow, c: 0 }, e: { r: rowIndex, c: 0 } });
        for (let i = startRow; i <= rowIndex; i++) {
          cellStyles[`A${i}`] = { border: borderStyle };
          cellStyles[`B${i}`] = { border: borderStyle };
          cellStyles[`C${i}`] = { border: borderStyle };
        }
      }

      rowIndex++;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    if (merges.length > 0) {
      worksheet['!merges'] = merges;
    }

    Object.keys(cellStyles).forEach((cell) => {
      if (worksheet[cell]) {
        worksheet[cell].s = cellStyles[cell];
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Expenses');

    const fileName = `WeeklyExpenses_${startDate}_to_${endDate}.xlsx`;

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
  }       
}