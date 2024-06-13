import styles from './statisticsPage.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { getDailyByEmail, getWeeklyByEmail, getMonthlyByEmail, getAllRecordByEmail } from '../../services/record-service';
import { useAuth } from '@/app/AuthContext';
import Header from './components/header/header';
import Histogram from './components/histoGram/histogram';
import PieChart from './components/pieChart/pieChart';
import DailyRecord from '@/models/record-daily';
import { getAllGoalByEmail } from '../../services/goal-service';
import Goal from '@/models/goal';

export default function StatisticsPage() {
  const { user } = useAuth(); // 获取用户信息
  const [daylyRecords, setDaylyRecords] = useState<DailyRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState('Statistics');
  const [pieData, setPieData] = useState<{ name: string, value: number }[]>([]);
  const [totalInvestedTime, setTotalInvestedTime] = useState<string>('');
  const [streak, setStreak] = useState<number>(0);


  // 定义 fetchAllRecordsByEmail 函数，并传递 user.email
  const fetchAllRecordsByEmail = useCallback(() => {
    if (user && user.email) {
      getDailyByEmail(user.email).then((items) => {
        setDaylyRecords(items);
        // console.log("statis Daily Records:", items);
      });
      getWeeklyByEmail(user.email).then((items) => {
        setWeeklyRecords(items);
        // console.log("statis Weekly Records:", items);
      });
      getMonthlyByEmail(user.email).then((items) => {
        setMonthlyRecords(items);
        // console.log("statis Monthly Records:", items);
      });
    }
  }, [user]);

  // 获取用户的所有 goals 并生成 pieData
  const fetchGraphData = useCallback(() => {
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

        // console.log("Pie Data:", data);
        // console.log("Total Invested Hours:", formattedTime);
      });
    }
  }, [user]);

  const fetchStreak = useCallback(() => {
    if (user && user.email) {
      getAllRecordByEmail(user.email).then((records: any[]) => {
        const today = moment().startOf('day');
        let currentStreak = 0;
  
        // 将记录的日期部分提取出来
        const dates = records.map(record => record.recordsDate.split('T')[0]);
  
        // 打印 records 和 dates
        // console.log("Records:", records);
        // console.log("Dates:", dates);
  
        const uniqueDates = Array.from(new Set(dates)).sort((a, b) => moment(a).diff(moment(b))); // 去重并排序
  
        // 打印 uniqueDates
        // console.log("Unique Dates:", uniqueDates);
  
        // 确定从哪天开始检查
        let startDate = today;
        if (!uniqueDates.includes(today.format('YYYY-MM-DD'))) {
          startDate = today.clone().subtract(1, 'days');
        }
  
        // 检查每一天是否有记录，从 startDate 开始往前
        for (let i = 0; ; i++) {
          const dateToCheck = startDate.clone().subtract(i, 'days').format('YYYY-MM-DD');
          console.log("Date to check:", dateToCheck);
          if (uniqueDates.includes(dateToCheck)) {
            currentStreak++;
          } else {
            break;
          }
        }
  
        setStreak(currentStreak);
        console.log("Current Streak:", currentStreak);
      });
    }
  }, [user]);
  // 使用 useEffect 调用 fetchAllRecordsByEmail 和 fetchGraphData
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
            <h3>{daylyRecords.length}</h3>
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
