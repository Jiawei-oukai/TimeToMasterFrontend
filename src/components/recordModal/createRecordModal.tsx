import React, { useState,useEffect } from 'react';
import styles from './createRecordModal.module.scss';
import DurationSelector from './DurationSelector';
import GoalCard from '../goalCard/goalCard3';
import Goal from '@/models/goal';
import Record from '@/models/record';
import RecordCreate from '@/models/record-create';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { useAuth } from '@/app/AuthContext';

import { createRecord } from '@/services/record-service';

interface Props {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Record) => void;
}

export default function CreateRecordModal(props: Props) {
  const {user} = useAuth();
  const [selectedTime, setSelectedTime] = useState(0);
  const [goalId, setGoalId] = React.useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleTimeSelected = (timeInMinutes: number) => {
    setSelectedTime((prevTime) => prevTime + timeInMinutes);
  };

  const handleReset = () => {
    setSelectedTime(0);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleClose = async () => {
    props.onClose();
    setSelectedTime(0);
    setFormError(null);
    setSubmitError(null);
  }

  const handleSubmit = async () => {
    if (selectedTime && props.goal && user) {
      const newRecord: RecordCreate = {
        userEmail: user.email,
        goalId: props.goal._id,
        goalName: props.goal.title,
        Time: selectedTime/60,
        recordsDate: selectedDate.toLocaleDateString(),
      };
      try {
        const createdRecord = await createRecord(newRecord);
        props.onSubmit(createdRecord);
        handleClose();
      } catch (error) {
        setSubmitError('Creating goal failed. Please try again.');
      }
    } else {
      setFormError('Please fill in all required fields: title and due date.');
    }
  }

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedTime) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedTime]);

  const formatTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours > 0 ? hours + 'h' : ''}${minutes > 0 ? minutes + 'min' : ''}`;
  };

  return (
    props.isOpen &&
    <div className={styles['modal']}>
      <div className={styles['page-container']}>
        <div className={styles['top-bar']}>
          Record Your Invested Time
        </div>

        <div className={styles.container}>
          <div className={styles['top-div']}>
            <GoalCard key={goalId}
              goal={props.goal} />
            <div className={`${styles['time-accumulator']} ${isVisible ? styles.visible : ''}`}>
              <div className={styles['time-display']}>
                {formatTime(selectedTime)}
              </div>
              <button className={styles['reset-button']} onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div className={styles['date-display']}>
            <p>Records</p>
            <div className={styles['current-date']}>
            <DatePicker selected={selectedDate} onChange={handleDateChange} />
            </div>
          </div>

          <DurationSelector onTimeSelected={handleTimeSelected} />
          <div className={styles['button-bar']}>
            <button className={styles['cancel-button']} onClick={props.onClose}>Cancel</button>
            <button className={styles['submit-button']} onClick={handleSubmit}>Submit</button>
          </div>
        </div>
        {/* <ClockBar imageSrc="path/to/your/image.png" /> */}
        {formError && <p className={styles.error}>{formError}</p>}
        {submitError && <p className={styles.error}>{submitError}</p>}
      </div>
    </div>
  );
}
