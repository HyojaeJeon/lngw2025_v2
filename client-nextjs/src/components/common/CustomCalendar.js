import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { ko, enUS, vi } from 'date-fns/locale';

const localeMap = { ko, en: enUS, vi };

export const CustomCalendar = ({ onDateSelect, selectedDate }) => {
  const [startDate, setStartDate] = useState(selectedDate ? new Date(selectedDate) : null);

  const handleDateChange = (date) => {
    setStartDate(date);
    if (onDateSelect && date) {
      onDateSelect(date.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="w-full">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        inline
        locale="ko"
        dateFormat="yyyy-MM-dd"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        scrollableYearDropdown
        calendarClassName="custom-calendar"
      />
      <style jsx global>{`
        .custom-calendar {
          font-family: inherit;
          border: none;
          box-shadow: none;
        }
        .react-datepicker__header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .react-datepicker__day--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        .react-datepicker__day:hover {
          background-color: #dbeafe !important;
        }
      `}</style>
    </div>
  );
};

export default CustomCalendar;