import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { DayExpense } from '../../shared/models/day-expense-interface';
import { CommonModule } from '@angular/common';
import { DayExpenseComponent } from '../day-expense/day-expense.component';
import { Weekdays } from '../../shared/models/weekdays-enum';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    // Calculate the current week's start (Monday) and end (Sunday) dates
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1)); // Adjust for Sunday
  
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
  
    const formatDate = (date: Date) =>
      `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const startDate = formatDate(monday);
    const endDate = formatDate(sunday);
  
    // Prepare the data and cell styles
    const data: any[] = [];
    const merges: XLSX.Range[] = []; // To store merge ranges
    let rowIndex = 1; // Start from row 1 for merging
    const borderStyle = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
      left: { style: 'thick' },
      right: { style: 'thick' },
    };
    const cellStyles: any = {};
  
    this.days.forEach((day) => {
      const expenses = this.weeklyExpenses[day];
      const startRow = rowIndex; // Track where the day's data starts
  
      // Add the "Day" header row and the first expense in the same row
      if (expenses.length > 0) {
        data.push({ Day: day.toUpperCase(), Category: expenses[0].category, Amount: expenses[0].amount });
      } else {
        data.push({ Day: day.toUpperCase(), Category: '', Amount: '' });
      }
  
      // Add subsequent rows for the remaining expenses
      for (let i = 1; i < expenses.length; i++) {
        data.push({ Day: '', Category: expenses[i].category, Amount: expenses[i].amount });
        rowIndex++;
      }
  
      // Add a merge for the "Day" column
      if (expenses.length > 0) {
        merges.push({ s: { r: startRow, c: 0 }, e: { r: rowIndex, c: 0 } }); // Merge the "Day" column
  
        // Apply a thick border around the entire day's block
        for (let i = startRow; i <= rowIndex; i++) {
          cellStyles[`A${i}`] = { border: borderStyle }; // "Day" column
          cellStyles[`B${i}`] = { border: borderStyle }; // "Category" column
          cellStyles[`C${i}`] = { border: borderStyle }; // "Amount" column
        }
      }
  
      rowIndex++;
    });
  
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // Apply merges
    if (merges.length > 0) {
      worksheet['!merges'] = merges;
    }
  
    // Apply styles
    Object.keys(cellStyles).forEach((cell) => {
      if (worksheet[cell]) {
        worksheet[cell].s = cellStyles[cell];
      }
    });
  
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Expenses');
  
    // Format the file name
    const fileName = `WeeklyExpenses_${startDate}_to_${endDate}.xlsx`;
  
    // Export the file
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
  }     
  
}