// components/CityInput.js
import React from 'react';

export default function CityInput({ city, handleCityChange }) {
  return (
    <div className="container mt-5">
      <label htmlFor="cityInput" className="form-label">DESTINATION</label>
      <input
        id="cityInput"
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter a city"
        className="form-control"
        style={{
          border: '1px solid #000',  // 1px 테두리
          borderRadius: '0',          // 라운드 처리 없음, 정사각형 모서리
        }}
      />
    </div>
  );
}
