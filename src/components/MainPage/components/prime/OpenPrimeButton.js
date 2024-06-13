import React from 'react';
import ApiService from './ApiService';

const OpenPrimeButton = () => {
  const handleButtonClick = () => {
    ApiService.openPrime()
      .then(response => {
        console.log('successed:', response.data);
      })
      .catch(error => {
        console.error('failed:', error);
      });
  };

  return (
    <button onClick={handleButtonClick}>
      open prime
    </button>
  );
};
export default OpenPrimeButton;
