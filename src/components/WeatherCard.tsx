import React from 'react';

// Define the expected structure of the weather data prop
interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface WeatherCardProps {
  weather: WeatherData;
  onClose: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onClose }) => {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-6 rounded-lg shadow-lg z-10 w-64">
      <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
      <div className="text-center">
        <h2 className="text-2xl font-bold">{weather.name}</h2>
        <div className="flex items-center justify-center">
            <img src={iconUrl} alt={weather.weather[0].description} className="w-16 h-16" />
            <p className="text-5xl font-light">{Math.round(weather.main.temp)}&deg;C</p>
        </div>
        <p className="text-lg capitalize">{weather.weather[0].description}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
