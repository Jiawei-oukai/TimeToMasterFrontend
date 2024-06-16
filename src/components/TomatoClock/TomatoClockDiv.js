import React, { useState, useEffect } from 'react';
import styles from './tomatoClockDiv.module.scss'; // Import the corresponding SCSS file

const TomatoClockDiv = ({ topImageSrc, middleImageSrc, startTime = '12:50' }) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    alert('Are you sure to abandon this clock?');
  };

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className={styles['tomato-clock-div']}>
      <div className={styles.top}>
        <img src={topImageSrc} alt="Top Image" className={styles.image} />
      </div>
      <div className={styles.middle}>
        <img src={middleImageSrc} alt="Middle Image" className={styles.image} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.timer}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className={styles['start-time']}>start at {startTime}</div>
      </div>
      <div className={styles.bar} onClick={handleClick}>
        <div className={styles.circle}>
          <div className={styles.square}></div>
        </div>
      </div>
    </div>
  );
};

export default TomatoClockDiv;
