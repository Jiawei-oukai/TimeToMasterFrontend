import React, { useState, useEffect, useCallback } from 'react';
import styles from './goalDetail.module.scss';
import Goal from '@/models/goal';
import Record from '@/models/record';
import Image from 'next/image';
import HistogramSmall from '@/components/HistoGram/histogramSmall';
import DailyRecord from '@/models/record-daily';
import { getAllRecordByEmail } from '@/services/record-service';
import moment from 'moment';

interface Props {
  goal: Goal | null;
  addRecord: (goal: Goal) => void;
  dailyRecords: DailyRecord[];
  weeklyRecords: DailyRecord[];
  monthlyRecords: DailyRecord[];
}

export default function GoalDetail(props: Props) {
  const [title, setTitle] = useState('');
  const [goalIcon, setGoalIcon] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<string | null>(null);
  const [daylyRecords, setDaylyRecords] = useState<DailyRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyRecord[]>([]);
  const [totalInvestedTime, setTotalInvestedTime] = useState<string>('');
  const [streak, setStreak] = useState<string>('');
  const [recordCount, setRecordCount] = useState<number>(0);

  const goalIcons = Array.from({ length: 12 }, (_, i) => require(`./goalicons/${i + 1}.png`));

  useEffect(() => {
    if (props.goal) {
      initializeModal();
    }
  }, [props.goal, props.dailyRecords, props.weeklyRecords, props.monthlyRecords]);

  const initializeModal = useCallback(() => {
    if (props.goal) {
      const date = new Date(props.goal.expectedCompletionDate);
      const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      setExpectedCompletionDate(localDateTime.toISOString().slice(0, 16));
      setTitle(props.goal.title);
      setTotalHours(props.goal.totalHours.toString());
      const goalIcon = goalIcons[props.goal.logo - 1];
      setGoalIcon(goalIcon);
      setDaylyRecords(props.dailyRecords);
      setWeeklyRecords(props.weeklyRecords);
      setMonthlyRecords(props.monthlyRecords);
      fetchGoalRecords(props.goal);
    }
  }, [props.goal, props.dailyRecords, props.weeklyRecords, props.monthlyRecords, goalIcons]);

  const fetchGoalRecords = useCallback((goal: Goal) => {
    if (goal) {
      getAllRecordByEmail(goal.userEmail).then((records: any[]) => {
        const goalRecords = records.filter(record => record.goalId === goal._id);
        const totalHours = goalRecords.reduce((total, record) => total + record.Time, 0);
        const formattedTime = Number.isInteger(totalHours) ? `${totalHours}h` : `${totalHours.toFixed(2)}h`;
        setTotalInvestedTime(formattedTime);
        setRecordCount(goalRecords.length);
        const today = moment().startOf('day');
        let currentStreak = 0;

        const dates = goalRecords.map(record => record.recordsDate.split('T')[0]);
        const uniqueDates = Array.from(new Set(dates)).sort((a, b) => moment(a).diff(moment(b)));

        let startDate = today;
        if (!uniqueDates.includes(today.format('YYYY-MM-DD'))) {
          startDate = today.clone().subtract(1, 'days');
        }

        for (let i = 0; ; i++) {
          const dateToCheck = startDate.clone().subtract(i, 'days').format('YYYY-MM-DD');
          if (uniqueDates.includes(dateToCheck)) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStreak(`${currentStreak}d`);
      });
    }
  }, []);

  return (
    <div className={styles['task-detail-page']}>
      <div className={styles.container}>
        <div className={styles['top-div']}>
          <div className={styles.left}>
            <Image src={goalIcon} alt="" width={200} height={180} />
          </div>
          <div className={styles.right}>
            <div className={styles.textContainer}>
              <div className={styles.title}>{title}</div>
              <div className={styles.subtitle}>Target Time: {totalHours} hours</div>
            </div>
            <button className={styles.button} onClick={() => props.addRecord(props.goal as Goal)}>
              <div className={styles.square}>
                <div className={styles.plus}>+</div>
              </div>
              <span className={styles.buttonText}>Add Invested Time</span>
            </button>
          </div>
        </div>
        <div className={styles['time-day-record-div']}>
          <div className={styles.overallContent}>
            <h3>{totalInvestedTime}</h3>
            <p>Total Time</p>
          </div>
          <div className={styles.overallContent}>
            <h3>{streak}</h3>
            <p>Streak</p>
          </div>
          <div className={styles.overallContent}>
            <h3>{recordCount}</h3>
            <p>Records</p>
          </div>
        </div>
        <div className={styles['chart-div']}>
          <HistogramSmall
            dailyRecords={daylyRecords}
            weeklyRecords={weeklyRecords}
            monthlyRecords={monthlyRecords}
          />
        </div>
      </div>
    </div>
  );
}
