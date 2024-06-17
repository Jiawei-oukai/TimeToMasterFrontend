"use client";
import styles from './page.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { getDailyByEmail, getWeeklyByEmail, getMonthlyByEmail, getAllRecordByEmail } from '@/services/record-service';
import { useAuth } from '@/app/AuthContext';
import Header from '@/components/header/header';
import Histogram from '@/components/histoGram/histogram';
import PieChart from '@/components/pieChart/pieChart';
import DailyRecord from '@/models/record-daily';
import { getAllGoalByEmail } from '@/services/goal-service';
import Goal from '@/models/goal';

export default function StatisticsPage() {
  const { user } = useAuth(); // Get user information
  const [allRecords, setAllRecords] = useState<DailyRecord[]>([]);
  const [daylyRecords, setDaylyRecords] = useState<DailyRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState('Statistics');
  const [pieData, setPieData] = useState<{ name: string, value: number }[]>([]);
  const [totalInvestedTime, setTotalInvestedTime] = useState<string>('');
  const [streak, setStreak] = useState<number>(0);

  const fetchAllRecordsByEmail = useCallback(() => {
    if (user && user.email) {
      getDailyByEmail(user.email).then((items) => {
        setDaylyRecords(items);
      });
      getWeeklyByEmail(user.email).then((items) => {
        setWeeklyRecords(items);
      });
      getMonthlyByEmail(user.email).then((items) => {
        setMonthlyRecords(items);
      });
    }
  }, [user]);

  // Fetch all goals for the user and generate pieData
  const fetchGraphData = () => {
    if (user && user.email) {
      getAllGoalByEmail(user.email).then((goals) => {
        const data = goals.map((goal: Goal) => ({
          name: goal.title,
          value: parseFloat(goal.investedHours.toFixed(2))
        }));
        setPieData(data);

        const totalHours = goals.reduce((total, goal) => total + goal.investedHours, 0);
        const hours = Math.floor(totalHours);
        const minutes = Math.round((totalHours - hours) * 60);
        const formattedTime = `${hours}H ${minutes}min`;
        setTotalInvestedTime(formattedTime);

      });
    }
  };

  // Fetch user's record streak
  const fetchStreak = () => {
    if (user && user.email) {
      getAllRecordByEmail(user.email).then((records: any[]) => {
        setAllRecords(records);
        const today = moment().startOf('day');
        let currentStreak = 0;
  
        // Extract the date part of the records
        const dates = records.map(record => record.recordsDate.split('T')[0]);
        const uniqueDates = Array.from(new Set(dates)).sort((a, b) => moment(a).diff(moment(b))); // Remove duplicates and sort
  
        // Determine the start date for checking
        let startDate = today;
        if (!uniqueDates.includes(today.format('YYYY-MM-DD'))) {
          startDate = today.clone().subtract(1, 'days');
        }
  
        // Check each day for records, starting from startDate and going backward
        for (let i = 0; ; i++) {
          const dateToCheck = startDate.clone().subtract(i, 'days').format('YYYY-MM-DD');
          if (uniqueDates.includes(dateToCheck)) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);
      });
    }
  };

  // Use useEffect to call fetchAllRecordsByEmail, fetchGraphData, and fetchStreak
  useEffect(() => {
    fetchAllRecordsByEmail();
    fetchGraphData();
    fetchStreak();
  }, [fetchAllRecordsByEmail, fetchGraphData]);

  return (
    <div className={styles.pageContainer}>
      <Header selectedTab={selectedTab} />
      <main className={styles.mainContent}>
        <div className={styles.topBlock}>
          <div className={styles.overallContent}>
            <h3>{totalInvestedTime}</h3>
            <p>Total Time</p>
          </div>
          <div className={styles.overallContent}>
            <h3>{streak} days</h3>
            <p>Streak</p>
          </div>
          <div className={styles.overallContent}>
            <h3>{allRecords.length}</h3>
            <p>Records</p>
          </div>
        </div>
        <div className={styles.bottomBlock}>
          <Histogram
            dailyRecords={daylyRecords}
            weeklyRecords={weeklyRecords}
            monthlyRecords={monthlyRecords}
          />
          <PieChart data={pieData} />
        </div>
      </main>
      <footer className="footer">
        <div className={styles.footContent}>© 2024 Jiawei Wang & Shiqi Lu. All rights reserved.</div>
      </footer>
    </div>
  );
}
