// pages/index.js
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import CityInput from '../components/CityInput';
import Weather from '../components/Weather';
import Recommendations from '../components/Recommendations';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'next/image';  // Image 컴포넌트 임포트

export default function Home() {
  const [city, setCity] = useState('서울');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
        .then(() => {
          console.log('Bootstrap JS loaded');
        })
        .catch((err) => {
          console.error('Bootstrap JS loading error:', err);
        });
    }
  }, []);

  const fetchRecommendations = useCallback(
    debounce(async (cityName) => {
      if (!cityName.trim()) {
        setRecommendations([]);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get('/api/recommendations', {
          params: { city: cityName },
        });

        setRecommendations(response.data.length > 0 ? response.data.slice(0, 9) : []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []  // 의존성 배열에는 필요한 모든 변수를 포함
  );

  const fetchWeather = useCallback(async (cityName) => {
    if (!cityName.trim()) {
      setWeather(null);
      setForecast([]);
      return;
    }

    try {
      const geoResponse = await axios.get(
        'https://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: cityName,
            limit: 1,
            appid: API_KEY,
          },
        }
      );

      const { lat, lon } = geoResponse.data[0];

      const currentWeatherResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat: lat,
            lon: lon,
            appid: API_KEY,
            units: 'metric',
            lang: 'en',  // 언어 설정을 영어로 변경
          },
        }
      );

      setWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/forecast',
        {
          params: {
            lat: lat,
            lon: lon,
            appid: API_KEY,
            units: 'metric',
            lang: 'en',  // 언어 설정을 영어로 변경
          },
        }
      );

      setForecast(forecastResponse.data.list);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null);
      setForecast([]);
    }
  }, [API_KEY]);  // API_KEY가 의존성 배열에 포함되어야 합니다

  useEffect(() => {
    if (city.trim()) {
      fetchRecommendations(city);
      fetchWeather(city);
    } else {
      setRecommendations([]);
      setWeather(null);
      setForecast([]);
    }
  }, [city, fetchRecommendations, fetchWeather]);  // 모든 필요한 의존성을 포함

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const isValidRating = (rating) => {
    return rating !== null && rating !== undefined && rating !== 'N/A';
  };

  const renderRatingIcons = (rating) => {
    const fullIcons = Math.floor(rating);
    const hasHalfIcon = rating % 1 >= 0.5;
    const emptyIcons = 5 - fullIcons - (hasHalfIcon ? 1 : 0);

    return (
      <div className="icon-container">
        {[...Array(fullIcons)].map((_, i) => (
          <i key={`full-${i}`} className="fas fa-star"></i>
        ))}
        {hasHalfIcon && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyIcons)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>TOURNEST</title>
      </Head>
      <NavBar />
      <CityInput city={city} handleCityChange={handleCityChange} />
      <Weather weather={weather} forecast={forecast} city={city} />
      <Recommendations
        recommendations={recommendations}
        loading={loading}
        isValidRating={isValidRating}
        renderRatingIcons={renderRatingIcons}
      />
      <Footer />
    </div>
  );
}
