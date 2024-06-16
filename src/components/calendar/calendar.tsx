import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles for the DatePicker
import styles from './calendar.module.scss'; // Import corresponding SCSS file
import { getByDate } from '@/services/record-service';
import Record from '@/models/record';
import { useAuth } from '@/app/AuthContext';

const Calendar: React.FC = () => {
  // State to store the selected date
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State to store the records fetched from the server
  const [records, setRecords] = useState<Record[]>([]);
  const { user } = useAuth(); // Get the current user from AuthContext

  // Function to fetch records for the selected date
  const fetchRecords = useCallback(async (date: Date) => {
    if (user) {
      try {
        console.log("Selected date:" + date.toISOString().split('T')[0]);
        const items = await getByDate(date.toISOString().split('T')[0], user.email);
        // Update the state with the fetched records
        setRecords(items);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }
  }, [user]);

  // useEffect to fetch records whenever the selected date changes
  useEffect(() => {
    fetchRecords(selectedDate);
  }, [selectedDate, fetchRecords]);

  // Handler for date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // Memoized computation of total hours from the records
  const totalHours = useMemo(() => {
    return records.reduce((sum, record) => sum + record.Time, 0);
  }, [records]);

  // Memoized formatting of total time into hours and minutes
  const formattedTotalTime = useMemo(() => {
    const wholeHours = Math.floor(totalHours);
    const totalMinutes = Math.round((totalHours - wholeHours) * 60);
    let formattedTime = '';
    if (wholeHours > 0) {
      formattedTime += `${wholeHours}h `;
    }
    if (totalMinutes > 0) {
      formattedTime += `${totalMinutes}min`;
    }
    return formattedTime;
  }, [totalHours]);

  // Formatting the selected date into a readable format
  const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;

  return (
    <div className={styles['page-container']}>
      <div className={styles['calendar']}>
        <div className={styles['top-bar']}>
          <div className={styles['title']}>
            <span>Calendar</span>
          </div>
        </div>
        <div className={styles['top-div']}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline={true} // Display the calendar inline
          />
        </div>
        <div className={styles['bottom-div']}>
          <div className={styles['bottom-top-bar']}>
            {formattedDate} {formattedTotalTime}
          </div>
          <div className={styles['records-container']}>
            {records.map((record, index) => {
              // Formatting each record's time into hours and minutes
              const hours = Math.floor(record.Time);
              const minutes = Math.round((record.Time - hours) * 60);
              let formattedTime = '';
              if (hours > 0) {
                formattedTime += `${hours}h `;
              }
              if (minutes > 0) {
                formattedTime += `${minutes}min`;
              }
              return (
                <div key={index} className={styles['record-data-div']}>
                  <p>{record.goalName}</p>
                  <h2>{formattedTime}</h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
