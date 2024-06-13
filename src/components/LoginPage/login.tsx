import React, { useState, useEffect } from 'react';
import styles from './login.module.scss';
import SignUpForm from './components/signUpForm'; // Import SignUpForm component
import { useAuth } from '@/app/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('visitor@example.com');
  const [password, setPassword] = useState<string>('example');
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailTouched, setIsEmailTouched] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { Authlogin: authlogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const handleLogin = async () => {
    // console.log('Sign in:', { email, password });
    if (email && password && isEmailValid) {
      try {
        const validatedUser = await authlogin({ email, password });
        if (validatedUser == null) {
          setError("Email or password mismatch");
        } else {
          console.log('Login successful');
          navigate('/home');
        }
      } catch (error) {
        console.error('Email or password mismatch:', error);
        setPassword('');
        setError('Email or password mismatch');
      }
    }
  };

  const handleRegister = () => {
    // Show sign-up form
    setShowSignUp(true);
    setEmail('');
    setIsEmailTouched(false);
    setPassword('');
    setError('');
  };

  const handleCloseSignUp = () => {
    // Close sign-up form
    setShowSignUp(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        {showSignUp ? (
          <SignUpForm 
          onClose={handleCloseSignUp} 
          setLoginEmail={setEmail}
          /> // Pass close sign-up form function
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
            <div className={styles.error}>{error}</div>
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

export default LoginPage;
