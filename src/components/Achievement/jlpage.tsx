"use client";
import styles from './jlpage.module.scss';

import React, { useState, useEffect } from 'react';
import { createAchievement, getAllAchievement, searchAchievement, updateAchievement, deleteAchievement } from '../../services/achievement-service';
import { getAllGoalByEmail, createGoal, updateGoal, deleteGoal } from '../../services/goal-service';
import { useAuth } from '@/app/AuthContext';
import AchievementCard from './components/achiev-card/achievement-card';

import Header from '../MainPage/components/header/header';
import Achievement from '@/models/achievement';
import Goal from '@/models/goal';

export default function Home() {
  const { user } = useAuth(); // 获取用户信息

  const [selectedTab, setSelectedTab] = useState('Achievement');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement>();
  const [colorIndex, setColorIndex] = useState(0);
  const [isGray, setIsGray] = useState(false); 
  const [shouldColorFirstFive, setShouldColorFirstFive] = useState(false); 
  const [completedGoalsCount, setCompletedGoalsCount] = useState<number>(0);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hasUpdatedColorsAndProperties, setHasUpdatedColorsAndProperties] = useState(false);

  const fetchAndSetGoals = async (userEmail: string) => {
    try {
      const goals = await getAllGoalByEmail(userEmail);
      setGoals(goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      fetchAndSetGoals(user.email);
    }
  }, [user]);

  const handleGoalCompletion = async (completedGoalId: string) => {
    let updatedFirstEmptyAchievement = false; 

    const updatedAchievements = achievements.map(achievement => {
      if (!updatedFirstEmptyAchievement && achievement.goalId === '') {
        updatedFirstEmptyAchievement = true;
        return {
          ...achievement,
          goalId: completedGoalId,
        };
      }
      return achievement;
    });
  
    setAchievements(updatedAchievements);
  
    const firstEmptyAchievement = updatedAchievements.find(achievement => achievement.goalId === completedGoalId);
    if (firstEmptyAchievement && !firstEmptyAchievement.achieved) {
      try {
        const timestamp = new Date();
        const timeString = timestamp.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
        const achievedDate = timestamp.toLocaleDateString() + ' ' + timeString;
  
        await updateAchievement(firstEmptyAchievement._id, {
          goalId: completedGoalId, 
          description: firstEmptyAchievement.description,
          achieved: true,
          achievementDate: achievedDate,
        });
      } catch (error) {
        console.error('Error updating achievement:', error);
      }
    }
  };

  const handleSave = async (newAchievement: Achievement) => {
    try {
      if (currentAchievement) {
        setAchievements(achievements.map((achievement) => {
          if (achievement._id === newAchievement._id) {
            return newAchievement;
          }
          return achievement;
        }));
        setEditModalOpen(false);

        await updateAchievement(newAchievement._id, {
          ...newAchievement,
          achieved: true, 
          achievementDate: new Date().toISOString(), 
        });
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const handleDelete = React.useCallback(async () => {
    if (!currentAchievement) {
      return;
    }
    try {
      await deleteAchievement(currentAchievement._id);
      setAchievements(achievements.filter((achievement) => achievement._id !== currentAchievement._id));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  }, [currentAchievement, achievements]);

  const colors = ["rgb(238,216,216)", "rgb(216,222,238)", "rgb(238,229,216)", "rgb(228,216,238)", "rgb(223,238,216)", "rgb(216,238,238)"];
  const cards = achievements.map((achievement, index) => {
    const isColored = index < completedGoalsCount; 
    const cardColor = isColored ? colors[index] : '#dcdcdc';
    return (
      <AchievementCard
        key={achievement._id}
        achievement={achievement}
        color={cardColor}
        isColored={isColored}
        shouldColorFirstFive={shouldColorFirstFive}
        index={index}
        goalId={achievement.goalId} 
        handleGoalCompletion={handleGoalCompletion} 
      />
    );
  });

  const updateAchievementColorsAndProperties = async () => {
    const completedGoalIds = goals.filter(goal => goal.progress === 1.0).map(goal => goal._id);
    setCompletedGoalsCount(completedGoalIds.length);

    const updatedAchievements = achievements.map(achievement => {
      const isColored = completedGoalIds.includes(achievement.goalId);
      const cardColor = isColored ? colors[completedGoalIds.indexOf(achievement.goalId)] : '#dcdcdc';
      const timestamp = new Date();
      const timeString = timestamp.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
      const achievedDate = timestamp.toLocaleDateString() + ' ' + timeString;

      if (isColored && !achievement.achieved) {
        const associatedGoal = goals.find(goal => goal._id === achievement.goalId);
        const goalIdToUpdate = associatedGoal ? associatedGoal._id : '';

        return {
          ...achievement,
          isColored,
          cardColor,
          achieved: true,
          achievementDate: achievedDate,
          goalId: goalIdToUpdate,
        };
      }

      return {
        ...achievement,
        isColored,
        cardColor,
      };
    });

    setAchievements(updatedAchievements);

    for (const updatedAchievement of updatedAchievements) {
      if (updatedAchievement.achieved && updatedAchievement.achievementDate) {
        await updateAchievement(updatedAchievement._id, {
          goalId: updatedAchievement.goalId,
          description: updatedAchievement.description,
          achieved: updatedAchievement.achieved,
          achievementDate: updatedAchievement.achievementDate,
        });
      }
    }
  };

  const fetchAndSetAchievements = async () => {
    try {
      const items = await getAllAchievement();
      setAchievements(items);
      setHasUpdatedColorsAndProperties(false); 
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  useEffect(() => {
    if (!hasUpdatedColorsAndProperties) {
      setHasUpdatedColorsAndProperties(true);
    }
    updateAchievementColorsAndProperties();
    fetchAndSetAchievements();
  }, [goals, completedGoalsCount, hasUpdatedColorsAndProperties]);

  return (
    <div className={styles.pageContainer}>
      <Header selectedTab={selectedTab} />
      <main className={styles.mainContent}>
        <div className={styles["grid-container"]}>
          <div className={styles["grid-achievements"]}>
            <div className={styles.bar}>
              <h1>Achievements</h1>
            </div>
            <div className={styles["achievement-container"]}>
              {cards}
            </div>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className={styles.footContent}>© 2024 Jiawei Wang & Shiqi Lu. All rights reserved.</div>
      </footer>
    </div>
  );
}
