import { Location } from '@/types/weather';
import { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export const useWeather = (initialLocation: Location) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>(initialLocation);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    // Keep previous weather data until new data is fetched

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('OpenWeather API key is not configured.');
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data.');
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeather(location.lat, location.lng);
    }
  }, [location]);

  return { weatherData, loading, error, location, setLocation };
};
