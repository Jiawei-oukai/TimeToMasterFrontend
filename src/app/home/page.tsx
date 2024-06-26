"use client";
import styles from './page.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import { addDays } from 'date-fns';
import { getAllGoalByEmail } from '@/services/goal-service';
import { getDailyByGid, getWeeklyByGid, getMonthlyByGid } from '@/services/record-service';
import { useAuth } from '@/app/AuthContext';
import Header from '@/components/Header/header';
import GoalCardMain from '@/components/GoalCard/goalCard2';
import Calendar from '@/components/Calendar/calendar';
import GoalDetail from '@/components/GoalDetail/goalDetail';
import CreateRecordGoalModal from '@/components/RecordModal/createRecordModal';

import Goal from '@/models/goal';
import Record from '@/models/record';
import DailyRecord from '@/models/record-daily';
import {getDateRange, fillMissingDates} from '@/utils/dateUtils';

type RecordsMap = { [key: string]: DailyRecord }

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState('Today');
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [daylyRecords, setDaylyRecords] = useState<DailyRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyRecord[]>([]);

  const [createRecordModalOpen, setCreateRecordModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal>();

  // Fetch All goals
  const goalCards = goals.map((goal) =>
    <GoalCardMain
      key={goal._id}
      goal={goal}
      onEdit={() => handleGoalSelect(goal)}
    ></GoalCardMain>);

  const fetchAllGoals = () => {
    if (user) {
      getAllGoalByEmail(user.email).then((items) => {
        setGoals(items);
        if (items.length > 0 && currentGoal === undefined) {
          setCurrentGoal(items[0]);
        }
      });
    }
  };

  const fetchAllRecordsByGid = () => {
    if (!currentGoal) return;


    getDailyByGid(currentGoal._id).then((items) => {
      const today = new Date();
      const dailyRange = getDateRange(addDays(today, -10), today); // Get the last 10 days
      const filledDailyRecords = fillMissingDates(items, dailyRange);
      setDaylyRecords(filledDailyRecords);
    });

    getWeeklyByGid(currentGoal._id).then((items) => {
      const formattedItems = items.map(item => {
        return {
          ...item,
          recordsDate: item.recordsDate.slice(5),// Remove year
        };
      });
      setWeeklyRecords(formattedItems);
    });

    getMonthlyByGid(currentGoal._id).then((items) => {
      const formattedItems = items.map(item => {
        return {
          ...item,
          recordsDate: item.recordsDate.slice(5),// Remove year
        };
      });
      setMonthlyRecords(formattedItems);
    });
  };
  

  //display the detail analysis for a goal
  const handleGoalSelect = (goal: Goal) => {
    setCurrentGoal(goal);
  };

  // Display modal to add record
  const handleEditRecord = (goal: Goal) => {
    setCurrentGoal(goal);
    setCreateRecordModalOpen(true);
  };

  // Create new record
  const handleCreateRecord = (newRecord: Record) => {
    setRecords([...records, newRecord]);
    setCreateRecordModalOpen(false);
    fetchAllGoals();
    fetchAllRecordsByGid();
  };

  
  useEffect(() => {
    fetchAllGoals();
  }, []);

  useEffect(() => {
    fetchAllRecordsByGid();
  }, [currentGoal]);
  

  return (
    <div className={styles.pageContainer}>
      <Header selectedTab={selectedTab} />

      <main className={styles.mainContent}>
        <div className={styles.selectorContainer}>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.goalListContainer}>
            <div className={styles.goalList}>
              {goalCards}
            </div>
          </div>
          <div className={styles.goalDetail}>
            <GoalDetail 
              goal={currentGoal || null}
              addRecord = {handleEditRecord}
              dailyRecords = {daylyRecords}
              weeklyRecords = {weeklyRecords}
              monthlyRecords= {monthlyRecords}
            />
          </div>
          <div className={styles.calendarContainer}>
            <Calendar />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className={styles.footContent}>© 2024 Jiawei Wang & Shiqi Lu. All rights reserved.</div>
      </footer>

      <CreateRecordGoalModal goal={currentGoal || null}
        isOpen={createRecordModalOpen}
        onClose={() => setCreateRecordModalOpen(false)}
        onSubmit={handleCreateRecord} />
    </div>
  );
}
