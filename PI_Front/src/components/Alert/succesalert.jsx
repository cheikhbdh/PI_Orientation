import React from 'react';
import './SuccessAlert.css';

const SuccessAlert = ({ message }) => {
  return (
    <div className="success-alert">
      <span className="success-message">{message}</span>
    </div>
  );
};

export default SuccessAlert;
