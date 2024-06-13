import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './signUpForm.module.scss';
import { signUp } from '@/services/signUp-service';
import { useNavigate } from 'react-router-dom';
import GoalCreate from '@/models/goal-create';
import { createGoal } from '@/services/goal-service';

interface SignUpFormProps {
  onClose: () => void;
  setLoginEmail: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onClose, setLoginEmail }) => {
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [signUpFailed, setSignUpFailed] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setIsFormValid(
      userName !== '' &&
      email !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      isPasswordMatch &&
      isEmailValid
    );
  }, [userName, email, password, confirmPassword, isPasswordMatch, isEmailValid]);

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

  const handleSignUp = async () => {
    if (isFormValid) {
      // console.log('Sign up:', { userName, email, password });
      try {
        const user = await signUp({ userName, email, password });
        if (user) {
          toast.success('Sign up successful');
          console.log('Sign up successful');
          setLoginEmail(email);
          await createDefaultGoalsForNewUser(email);
          onClose();
        } else {
          setSignUpFailed('Email already exists');
        }
      } catch (error) {
        if (error instanceof Error) {
          setSignUpFailed(error.message);
        }
      }
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
                setIsEmailTouched(true);
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
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
            />
            {!isPasswordMatch && confirmPassword && (
              <div className={styles.error}>Passwords do not match!</div>
            )}
          </div>
          <div>{signUpFailed}</div>
          <button onClick={handleSignUp} className={styles.button} disabled={!isFormValid}>Sign Up</button>
          <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
