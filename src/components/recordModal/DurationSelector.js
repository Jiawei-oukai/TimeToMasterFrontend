
import React, { useState } from 'react';
import styles from './createRecordModal.module.scss';

const DurationSelector = ({ onTimeSelected }) => {
  const [selectedDuration, setSelectedDuration] = useState(null);

  const durations = ['1min', '5min', '10min', '25min', '30min', '45min', '60min', '2h', '5h', '20h', '50h', '100h'];

  const handleDurationClick = (duration, index) => {
    setSelectedDuration(index);
    let minutes = 0;
    if (duration.endsWith('h')) {
      minutes = parseInt(duration.slice(0, -1)) * 60;
    } else if (duration.endsWith('min')) {
      minutes = parseInt(duration.slice(0, -3));
    }
    onTimeSelected(minutes);
  };

  return (
    <div className={styles['duration-selector']}>
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {durations.slice(rowIndex * 4, (rowIndex + 1) * 4).map((duration, index) => (
            <div
              key={index + rowIndex * 4}
              className={selectedDuration === index + rowIndex * 4 ? styles.selected : styles.durationBox}
              onClick={() => handleDurationClick(duration, index + rowIndex * 4)}
            >
              <div className={styles["duration-circle"]}>+</div>{duration}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DurationSelector;
 


