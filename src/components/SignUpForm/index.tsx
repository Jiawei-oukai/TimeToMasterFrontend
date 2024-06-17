import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import { signUp } from '@/services/signUp-service';
import GoalCreate from '@/models/goal-create';
import { createGoal } from '@/services/goal-service';
import { DEFAULT_EMAIL, DEFAULT_PASSWORD } from '@/app/login/constants';

interface SignUpFormProps {
  onClose: () => void;
  setLoginEmail: (email: string) => void;
  setLoginPassword: (password: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose, setLoginEmail, setLoginPassword}) => {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmedPassword, setConfirmedPassword] = useState<string>('');
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailTouched, setIsEmailModified] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setIsPasswordMatch(password === confirmedPassword);
  }, [password, confirmedPassword]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setIsFormValid(
      userName !== '' &&
      email !== '' &&
      password !== '' &&
      confirmedPassword !== '' &&
      isPasswordMatch &&
      isEmailValid
    );
  }, [userName, email, password, confirmedPassword, isPasswordMatch, isEmailValid]);

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        const user = await signUp({ userName, email, password });
        if (user) {
          toast.success('Sign up successful');
          setLoginEmail(email);
          await createDefaultGoalsForNewUser(email);
          onClose();
        } else {
          setError('Email already exists');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    }
  };

  const handleCancel = () => {
    setLoginEmail(DEFAULT_EMAIL);
    setLoginPassword(DEFAULT_PASSWORD);
    onClose();
  }

  const createDefaultGoalsForNewUser = async (email: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 2000);
    const dateString = today.toISOString().split('T')[0];

    const defaultGoals: GoalCreate[] = [
      { userEmail: email, title: 'Learn Java', totalHours: '10000', expectedCompletionDate: dateString, logo: 4 },
      { userEmail: email, title: 'Do sports', totalHours: '10000', expectedCompletionDate: dateString, logo: 12 },
      { userEmail: email, title: 'Learn React', totalHours: '10000', expectedCompletionDate: dateString, logo: 2 },
      { userEmail: email, title: 'Learn TypeScript', totalHours: '10000', expectedCompletionDate: dateString, logo: 3 },
    ];

    for (const goal of defaultGoals) {
      await createGoal(goal);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.signUpContainer}>
        <div className={styles.signUpForm}>
          <div className={styles.inputContainer}>
            <label htmlFor="username" className={styles.label}>User Name:</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email" className={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailModified(true);
              }}
              className={styles.input}
            />
            {!isEmailValid && isEmailTouched && (
              <div className={styles.error}>Invalid email format!</div>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password" className={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="confirmedPassword" className={styles.label}>Confirm Password:</label>
            <input
              type="password"
              id="confirmedPassword"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              className={styles.input}
            />
            {!isPasswordMatch && confirmedPassword && (
              <div className={styles.error}>Passwords do not match!</div>
            )}
          </div>
          <div className={styles.error}>{error}</div>
          <button onClick={handleSubmit} className={styles.button} disabled={!isFormValid}>Sign Up</button>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
