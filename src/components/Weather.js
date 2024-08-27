import React from 'react';

export default function Weather({ city, weather, forecast }) {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);  
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).format(date);
  };

  const getDailyForecast = () => {
    const dailyData = [];
    const forecastByDate = {};

    forecast.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toDateString(); 

      if (!forecastByDate[date]) {
        forecastByDate[date] = [];
      }

      forecastByDate[date].push(entry);
    });

    for (const date in forecastByDate) {
      const dayData = forecastByDate[date];
      const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;

      dailyData.push({
        date: dayData[0].dt,
        temp: avgTemp,
        temp_max: Math.max(...dayData.map(item => item.main.temp_max)),
        temp_min: Math.min(...dayData.map(item => item.main.temp_min)),
        description: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon,  
      });
    }

    return dailyData;
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="container mt-5">
      {weather ? (
        <div
          className="card mb-4 text-center weather-card"
          style={{ borderRadius: '0', border: '1px solid black' }} 
        >
          <div className="card-body">
            <h5 className="card-title">{city}의 현재 날씨</h5> 
            <p className="card-text">
              온도: {weather.main.temp}°C<br />
              습도: {weather.main.humidity}%<br />
              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} /><br />
              <span>{weather.weather[0].description}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center">날씨 정보를 불러오고 있습니다</p>
      )}

      <div className="container mt-5">
        {dailyForecast.length > 0 ? (
          <div className="row justify-content-center">
            {dailyForecast.slice(0, 7).map((day, index) => (
              <div
                key={index}
                className="col-12 col-md-6 col-lg text-center mb-4 weather-card"
              >
                <div
                  className="card"
                  style={{
                    borderRadius: '0',
                    border: '1px solid black', 
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{formatDate(day.date)}</h5>
                    <p className="card-text">
                      최고: {day.temp_max}°C<br />
                      최저: {day.temp_min}°C<br />
                      <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} /><br />
                      {day.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">일주일 날씨 정보를 불러오고 있습니다</p>
        )}
      </div>
    </div>
  );
}
