import React, { useState, useEffect } from 'react';
import styles from './editGoalModal.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Goal from '@/models/goal';
import PartialGoal from '@/models/goal-update';

import goalIcon1 from './goalIcons/1.png';
import goalIcon2 from './goalIcons/2.png';
import goalIcon3 from './goalIcons/3.png';
import goalIcon4 from './goalIcons/4.png';
import goalIcon5 from './goalIcons/5.png';
import goalIcon6 from './goalIcons/6.png';
import goalIcon7 from './goalIcons/7.png';
import goalIcon8 from './goalIcons/8.png';
import goalIcon9 from './goalIcons/9.png';
import goalIcon10 from './goalIcons/10.png';
import goalIcon11 from './goalIcons/11.png';
import goalIcon12 from './goalIcons/12.png';

import { updateGoal, deleteGoal } from '../../../../services/goal-service';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  goal: Goal | null;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const images = [goalIcon1, goalIcon2, goalIcon3, goalIcon4, goalIcon5, goalIcon6
  , goalIcon7, goalIcon8, goalIcon9, goalIcon10, goalIcon11, goalIcon12];

export default function EditGoalModal(props: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [totalHours, setTotalHours] = useState<string>("");
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    initializeModal();
  }, [props.isOpen]);

  const initializeModal = () => {
    if (props.goal) {
      const date = new Date(props.goal.expectedCompletionDate);
      // const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      setExpectedCompletionDate(date);
      setTitle(props.goal.title);
      setTotalHours(props.goal.totalHours.toString());
    }
  };

  const handleTotalHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setTotalHours(value === 0 ? "" : value.toString());
  };

  const handleSave = async () => {
    if (title && expectedCompletionDate && props.goal) {
      const updatedGoal: PartialGoal = {
        title: title,
        totalHours: totalHours,
        expectedCompletionDate: expectedCompletionDate.toISOString(),
        logo: selectedImageIndex || props.goal.logo
      };
      try {
        await updateGoal(props.goal._id, updatedGoal);
        props.onSave();
      } catch (error) {
        setSubmitError('Updating goal failed. Please try again.');
      }
    } else {
      setFormError('Please fill in all required fields: Title, Total Hours, and Expected Completion Date.');
    }
  };

  const handleClose = () => {
    props.onClose();
    resetForm();
  };

  const handleDelete = async () => {
    if (!props.goal) { return; }
    await deleteGoal(props.goal._id);
    props.onDelete();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setTotalHours('');
    setExpectedCompletionDate(null);
    setFormError(null);
    setSubmitError(null);
  };

  return (
    props.isOpen &&
    <div className={styles.modal}>
      <div className={styles['modal-content']}>
        <div className={styles['goal-title-div']}>
          <span>Goal Title : </span>
          <input type="text" id="edit-title" title="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles['goal-time-div']}>
          <span>Target Total Time: </span>
          <input type="number" id="edit-description" title="edit-description"
            value={totalHours}
            onChange={handleTotalHoursChange}
          />
          <span> Hours</span>
        </div>
        <div className={styles['goal-ddl-div']}>
          <span>Expected completion date: </span>
          <DatePicker
            selected={expectedCompletionDate}
            onChange={(date: Date) => setExpectedCompletionDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className={styles.datePicker}
            showPopperArrow={false}
            minDate={new Date()}
          />
        </div>

        <div className={styles['select-logo']}>Please select a logo</div>
        <div className={styles['image-selection']}>
          {images.map((image, index) => (
            <div className={styles['image-container']} key={index} onClick={() => setSelectedImageIndex(index + 1)}>
              <Image
                src={image}
                alt={`Image ${index}`}
                width={200}
                height={180}
                className={selectedImageIndex === (index + 1) ? `${styles.image} ${styles.selected}` : styles.image}
              />
            </div>
          ))}
        </div>

        <div className={styles['button-bar']}>
          <button className={styles['delete-button']} onClick={handleDelete}>Delete</button>
          <div className={styles['spacer']}></div>
          <button className={styles['cancel-button']} onClick={handleClose}>Cancel</button>
          <button className={styles['submit-button']} onClick={handleSave}>Done</button>
        </div>
        {formError && <p className={styles.error}>{formError}</p>}
        {submitError && <p className={styles.error}>{submitError}</p>}
      </div>
    </div>
  );
};
