import React from 'react';
import '../App.css';

const ChakraLoader = ({ isLoading = true, message = 'Opening the text...' }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-screen">
      <div className="loader-content">
        <div className="loader-mark" aria-hidden="true">ॐ</div>
        <div className="loader-rule" />
        <p className="section-kicker">Bheeshma</p>
        <h2 className="mt-3 font-heading text-2xl text-cosmic-blue">{message}</h2>
        <p className="mt-5 text-xs uppercase tracking-[0.16em] text-soft-gold">Loading</p>
      </div>
    </div>
  );
};

export default ChakraLoader;
