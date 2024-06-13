import styles from './mainPage.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllGoalByEmail } from '../../services/goal-service';
import { getDailyByGid, getWeeklyByGid, getMonthlyByGid } from '../../services/record-service';
import { useAuth } from '@/app/AuthContext';
import Header from './components/header/header';
import GoalCardMain from './components/goalCard/goalCard2';
import Calendar from './components/calendar/calendar';
import GoalDetail from './components/goalDetail/goalDetail';
import CreateRecordGoalModal from './components/recordModal/createRecordModal';

import Goal from '@/models/goal';
import Record from '@/models/record';
import DailyRecord from '@/models/record-daily';

export default function MainPage() {
  const [selectedTab, setSelectedTab] = useState('Today');
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [daylyRecords, setDaylyRecords] = useState<DailyRecord[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<DailyRecord[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyRecord[]>([]);

  const [createRecordModalOpen, setCreateRecordModalOpen] = useState(false);
  const [goalDetailOpen, setGoalDetailOpen] = useState(true);
  const [currentGoal, setCurrentGoal] = useState<Goal>();

  // Fetch All goals
  const goalCards = goals.map((goal) =>
    <GoalCardMain
      key={goal._id}
      goal={goal}
      onEdit={() => handleEdit(goal)}
    ></GoalCardMain>);

  const fetchAllGoals = useCallback(() => {
    if (user) {
      getAllGoalByEmail(user.email).then((items) => {
        setGoals(items);
        if (items.length > 0 && currentGoal === undefined) {
          setCurrentGoal(items[0]);
        }
      });
    }
  }, [user, currentGoal]);

  // Display modal to edit goal
  const handleEdit = (goal: Goal) => {
    setCurrentGoal(goal);
    setGoalDetailOpen(true);
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

  // Fetch All records
  const fetchAllRecordsByGid = useCallback(() => {
    if (!currentGoal) return;
  
    getDailyByGid(currentGoal._id).then((items) => {
      setDaylyRecords(items);
    });
    getWeeklyByGid(currentGoal._id).then((items) => {
      setWeeklyRecords(items);
    });
    getMonthlyByGid(currentGoal._id).then((items) => {
      setMonthlyRecords(items);
    });
  }, [currentGoal]);

  useEffect(() => {
    fetchAllGoals();
    fetchAllRecordsByGid();
  }, [fetchAllGoals, fetchAllRecordsByGid, goalDetailOpen]);
  

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
            <GoalDetail isOpen={goalDetailOpen}
              goal={currentGoal || null}
              onClose={() => setGoalDetailOpen(false)}
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
