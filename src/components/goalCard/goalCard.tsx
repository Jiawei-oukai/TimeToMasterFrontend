import styles from './goalCard.module.scss';

import React, { useState } from 'react';
import Image from 'next/image';

import GoalDetailModal from '../GoalModal/editGoalModal';

import Goal from '@/models/goal';

interface Props {
    goal: Goal;
    onEdit: (goal: Goal) => void;
}

export default function goalCard(props: Props) {
    const goalIcons = Array.from({ length: 12 }, (_, i) => require(`./goalicons/${i + 1}.png`));
    const goalIcon = goalIcons[props.goal.logo - 1];

    const timestamp = new Date(props.goal.expectedCompletionDate);
    const expectedCompletionDate = timestamp.toLocaleDateString();

    const rawProgress = props.goal.progress * 100;
    const formattedProgress = rawProgress % 1 === 0 ? rawProgress.toFixed(0) + "%" : rawProgress.toFixed(1) + "%";


    const handleEdit = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        props.onEdit(props.goal);
    };
    return (
        <div className={styles.goalCard} id={props.goal._id} onClick={handleEdit} >
            <div className={styles.icon}>
                <Image src={goalIcon} alt="" width={200} height={180} />
            </div>

            <div className={styles.goalDetails}>
                <div className={styles.goalName}>{props.goal.title}</div>
                <div className={styles.goalInfo}>
                    <div className={styles.goalInfoItem}>
                        <span className={styles.goalLabel}>Total Hours :</span> {props.goal.totalHours.toFixed(2)}
                    </div>
                    <div className={styles.goalInfoItem}>
                        <span className={styles.goalLabel}>Progress :</span> {formattedProgress}
                    </div>
                    <div className={styles.goalInfoItem}>
                        <span className={styles.goalLabel}>Deadline :</span> {expectedCompletionDate}
                    </div>
                </div>
            </div>


            <div className={styles.completedTime}>
                <div className={styles.completedTimeText}>{" "}
                    {Number.isInteger(props.goal.investedHours)
                        ? props.goal.investedHours
                        : props.goal.investedHours.toFixed(2)} h</div>
            </div>


        </div>
    );
}
