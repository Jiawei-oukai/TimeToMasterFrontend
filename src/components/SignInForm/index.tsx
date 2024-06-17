"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/AuthContext';
import styles from './styles.module.scss';
import SignUpForm from '@/components/SignUpForm';

interface SignUpFormProps {
  defaultEmail: string;
  defaultPassword: string;
}

const SignInForm: React.FC<SignUpFormProps> = ({ defaultEmail, defaultPassword }) => {
  const [email, setEmail] = useState<string>(defaultEmail);
  const [password, setPassword] = useState<string>(defaultPassword);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailModified, setIsEmailModified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { Authlogin: authlogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const handleLogin = async () => {
    if (email && password && isEmailValid) {
      try {
        const validatedUser = await authlogin({ email, password });
        if (validatedUser == null) {
          setError("Email or password mismatch");
        } else {
          router.push('/home');
        }
      } catch (error) {
        setPassword('');
        setError('Email or password mismatch');
      }
    }
  };

  const handleRegister = () => {
    setShowSignUp(true);
    setEmail('');
    setIsEmailModified(false);
    setPassword('');
    setError('');
  };

  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        {showSignUp ? (
          <SignUpForm
            onClose={handleCloseSignUp}
            setLoginEmail={setEmail}
            setLoginPassword={setPassword}
          />
        ) : (
          <div className={styles.loginForm}>
            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.label}>Email:</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailModified(true);
                }}
                className={styles.input}
              />
              {!isEmailValid && isEmailModified && (
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
            {error && <div className={styles.error}>{error}</div>}
            <button
              onClick={handleLogin}
              className={styles.button}
              disabled={!email || !password || !isEmailValid}
            >
              Sign In
            </button>
            <button
              onClick={handleRegister}
              className={`${styles.button} ${styles.registerButton}`}
            >
              Sign Up
            </button>
            <div className={styles.info}>
              <p>Please use the given account to explore the website</p>
              <p>or register a new account.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInForm;