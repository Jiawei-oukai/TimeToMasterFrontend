import React, { useState } from 'react';
import styles from './createGoalModal.module.scss';
import Goal from '@/models/goal';
import GoalCreate from '@/models/goal-create';
import { useAuth } from '@/app/AuthContext';
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
import Image from 'next/image';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { createGoal } from '../../../../services/goal-service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (goal: Goal) => void;
}

const images = [goalIcon1, goalIcon2, goalIcon3, goalIcon4, goalIcon5, goalIcon6
  , goalIcon7, goalIcon8, goalIcon9, goalIcon10, goalIcon11, goalIcon12];

export default function CreateGoalModal(props: Props) {
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [totalHours, setTotalHours] = useState<string>("");
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<Date | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleTotalHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(e.target.value));
    setTotalHours(value === 0 ? "" : value.toString());
  };

  const handleSubmit = async () => {
    if (title && totalHours && expectedCompletionDate && selectedImageIndex && user) {
      const newGoal: GoalCreate = {
        title,
        totalHours,
        expectedCompletionDate: expectedCompletionDate.toISOString(),
        userEmail: user.email,
        logo: selectedImageIndex,
      };
      try {
        const createdGoal = await createGoal(newGoal);
        props.onCreate(createdGoal);
        handleClose();
      } catch (error) {
        setSubmitError('Creating goal failed. Please try again.');
      }
    } else {
      setFormError('Please fill in all required fields: title and due date.');
    }
  };

  const handleClose = () => {
    props.onClose();
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
          <h2>Create a new Goal</h2>
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
            minDate={new Date()} // This ensures past dates cannot be selected
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
          <button className={styles['cancel-button']} onClick={handleClose}>Cancel</button>
          <button className={styles['submit-button']} onClick={handleSubmit}>Submit</button>
        </div>
        {formError && <p className={styles.error}>{formError}</p>}
        {submitError && <p className={styles.error}>{submitError}</p>}
      </div>
    </div>
  );
};
