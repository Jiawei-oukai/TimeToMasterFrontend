import styles from './goalCard3.module.scss';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import Goal from '@/models/goal';

interface Props {
    goal: Goal | null;
}

export default function GoalCard(props: Props) { // 修改为以大写字母开头

    const goalIcons = Array.from({ length: 12 }, (_, i) => require(`./goalicons/${i + 1}.png`));
    const [title, setTitle] = useState("");
    const [goalIcon, setGoalIcon] = useState("");

    useEffect(() => {
        initializeModal();
    }, [props.goal]);

    const initializeModal = () => {
        if (props.goal) {
            setTitle(props.goal.title);
            const goalIcon = goalIcons[props.goal.logo - 1];

            setGoalIcon(goalIcon);
        } else {
            setTitle('Test');
            const goalIcon = goalIcons[1];
            setGoalIcon(goalIcon);
        }
    };

    return (
        <div className={styles.goalCard}>
            <div className={styles.icon}>
                <Image src={goalIcon} alt="" width={80} height={80} />
            </div>

            <div className={styles.goalDetails}>
                <div className={styles.goalName}>{title}</div>
            </div>
        </div>
    );
}
