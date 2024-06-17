"use client";
import styles from './page.module.scss';
import React, { useState, useEffect, useCallback } from 'react';
import { getAllGoalByEmail, searchGoal, deleteGoal } from '@/services/goal-service'; // Ensure deleteGoal is imported
import { useAuth } from '@/app/AuthContext';
import Header from '@/components/Header/header';
import TypeSelector from '@/components/TypeSelector/typeSelector';
import GoalCard from '@/components/GoalCard/goalCard';
import CreateGoalModal from '@/components/GoalModal/createGoalModal';
import EditGoalModal from '@/components/GoalModal/editGoalModal';

import Goal from '@/models/goal';

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal>();

  const [selectedTab, setSelectedTab] = useState('Goals');

  // Display modal to edit goal
  const handleEdit = (goal: Goal) => {
    setCurrentGoal(goal);
    setEditModalOpen(true);
  };

  // Create new goal
  const handleCreate = (newGoal: Goal) => {
    setGoals([...goals, newGoal]);
    setCreateModalOpen(false);
  };

  // Update a goal
  const handleSave = async () => {
    fetchAllGoals();
    setEditModalOpen(false);
  };

  

  const goalCards = goals.map((goal) =>
    <GoalCard
      key={goal._id}
      goal={goal}
      onEdit={() => handleEdit(goal)}
    ></GoalCard>);

  // Fetch All goals
  const fetchAllGoals = useCallback(() => {
    if (user) {
      getAllGoalByEmail(user.email).then((items) => {
        setGoals(items);
      });
    }
  }, [user]);

  // Delete a goal
  const handleDelete = React.useCallback(async () => {
    if (!currentGoal) { return; }
    await deleteGoal(currentGoal._id);
    fetchAllGoals();  // Refresh the goals list
    setEditModalOpen(false);
  }, [currentGoal, fetchAllGoals]);
  
  useEffect(() => {
    fetchAllGoals();
  }, [fetchAllGoals, editModalOpen]);

  // search goal based on type progress/completed
  const [activeButton, setActiveButton] = useState('All');

  const handleButtonClick = async (buttonLabel: string) => {
    if (user) {
      setActiveButton(buttonLabel);
      const items = await searchGoal<Goal>(buttonLabel, user.email);
      setGoals(items);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header selectedTab={selectedTab} />

      <main className={styles.mainContent}>
        <div className={styles.selectorContainer}>
          <TypeSelector activeButton={activeButton} onButtonClick={handleButtonClick} />
          <div className={styles.addButton}>
            <div className={styles.innerCircle}>
              <span className={styles.plusSign} onClick={() => setCreateModalOpen(true)}>+</span>
            </div>
          </div>
        </div>

        <div className={styles.goalList}>{goalCards}</div>
        <footer className={styles.footer}>
          <div className={styles.footContent}>© 2024 Jiawei Wang & Shiqi Lu. All rights reserved.</div>
        </footer>
      </main>

      <CreateGoalModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />

      <EditGoalModal
        isOpen={editModalOpen}
        goal={currentGoal || null}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
