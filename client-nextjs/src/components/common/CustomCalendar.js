import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';
import { ko, enUS, vi } from 'date-fns/locale';

const localeMap = { ko, en: enUS, vi };
const monthFormatMap = { ko: 'yyyy년 MM월', en: 'MMMM yyyy', vi: "'tháng' MM yyyy" };
const getMonthLabel = (month, language) => {
  if (language === 'vi') return `Tháng ${month + 1}`;
  if (language === 'ko') return `${month + 1}월`;
  // 영어는 date-fns locale 사용
  return enUS.localize.month(month, { width: 'wide' });
};
const dayNamesMap = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  vi: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

export default function CustomCalendar({ value, onChange, placeholder, disabled, language = 'ko', t }) {
  const { theme } = useTheme();
  const locale = localeMap[language] || ko;
  registerLocale(language, locale);

  // 현재 선택된 날짜 객체
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="relative w-full">
      <DatePicker
        selected={selectedDate}
        onChange={date => onChange(date ? date.toISOString().split('T')[0] : '')}
        dateFormat={monthFormatMap[language] || 'yyyy-MM-dd'}
        locale={language}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        calendarClassName={`rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-[#18181b] ${theme === 'dark' ? 'text-white' : 'text-gray-900'} calendar-responsive`}
        dayClassName={date =>
          `rounded-xl w-10 h-10 flex items-center justify-center transition-colors cursor-pointer
          ${theme === 'dark' ? 'hover:bg-purple-900' : 'hover:bg-purple-100'}
          `
        }
        renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled, changeYear, changeMonth }) => (
          <div className="flex items-center justify-between mb-4">
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <select
                value={date.getFullYear()}
                onChange={e => {
                  changeYear(Number(e.target.value));
                }}
                className="bg-transparent text-lg font-bold focus:outline-none dark:text-white dark:bg-[#18181b] border-none"
              >
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={date.getMonth()}
                onChange={e => {
                  changeMonth(Number(e.target.value));
                }}
                className="bg-transparent text-lg font-bold focus:outline-none dark:text-white dark:bg-[#18181b] border-none"
              >
                {Array.from({ length: 12 }, (_, i) => i).map(month => (
                  <option key={month} value={month}>{getMonthLabel(month, language)}</option>
                ))}
              </select>
            </div>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-800 transition disabled:opacity-30">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        renderDayContents={(day, date) => (
          <span className="block w-full h-full flex items-center justify-center">
            {day}
          </span>
        )}
        placeholderText={placeholder}
        disabled={disabled}
        popperClassName="z-50"
        customInput={
          <input
            className={
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground transition-all pr-10'
            }
            disabled={disabled}
            placeholder={placeholder}
            readOnly
          />
        }
      />
      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
      <style jsx global>{`
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background: #a78bfa !important;
          color: #fff !important;
          border-radius: 0.75rem !important;
        }
        .react-datepicker__day:hover {
          background: #ede9fe !important;
          color: #7c3aed !important;
        }
        .react-datepicker__header {
          background: transparent;
          border-bottom: none;
        }
        .react-datepicker__current-month {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .react-datepicker__day-name {
          color: #a78bfa;
          font-weight: 600;
        }
        .react-datepicker__month-dropdown, .react-datepicker__year-dropdown {
          background: #fff;
          color: #333;
        }
        .dark .react-datepicker__month-dropdown, .dark .react-datepicker__year-dropdown {
          background: #18181b;
          color: #fff;
        }
        .dark .react-datepicker, .dark .react-datepicker__month-container {
          background: #18181b !important;
          color: #fff !important;
        }
        .dark .react-datepicker__day, .dark .react-datepicker__day-name {
          color: #e0e0e0 !important;
        }
        .dark .react-datepicker__day--selected, .dark .react-datepicker__day--keyboard-selected {
          background: #a78bfa !important;
          color: #fff !important;
        }
        .dark .react-datepicker__day:hover {
          background: #6d28d9 !important;
          color: #fff !important;
        }
        @media (max-width: 480px) {
          .calendar-responsive {
            padding: 0.5rem !important;
            min-width: 220px !important;
            font-size: 0.95rem !important;
          }
          .calendar-responsive .react-datepicker__day,
          .calendar-responsive .react-datepicker__day-name {
            width: 2rem !important;
            height: 2rem !important;
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </div>
  );
} 