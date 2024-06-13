import React from 'react';
import ApiService from './ApiService';

const ClosePrimeButton = () => {
  const handleButtonClick = () => {
    ApiService.closePrime()
      .then(response => {
        console.log('successed:', response.data);
      })
      .catch(error => {
        console.error('failed:', error);
      });
  };

  return (
    <button onClick={handleButtonClick}>
      close prime
    </button>
  );
};
export default ClosePrimeButton;
