import React, { useState, useEffect } from 'react';
import styles from './clockBar.module.scss'; // Import the corresponding SCSS file

const ClockBar = ({ imageSrc }) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className={styles['clock-bar']}>
      <div className={styles.left}>
        <img src={imageSrc} alt="Logo" className={styles.image} />
        <span className={styles.text}>learn cs</span>
      </div>
      <div className={styles.middle} />
      <div className={styles.right}>
        <div className={styles.timer}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default ClockBar;
