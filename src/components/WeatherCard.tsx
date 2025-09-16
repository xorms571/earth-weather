import React from 'react';

// Define the expected structure of the weather data prop
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

interface WeatherCardProps {
  weather: WeatherData;
  onClose: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onClose }) => {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-white w-80 border border-white/20">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl font-bold">{weather.name}</h2>
        <button onClick={onClose} className="text-2xl leading-none font-semibold text-white/70 hover:text-white transition-colors">&times;</button>
      </div>
      <div className="flex items-center justify-center my-4">
        <img src={iconUrl} alt={weather.weather[0].description} className="w-24 h-24 -ml-4" />
        <p className="text-7xl font-thin tracking-tighter">{Math.round(weather.main.temp)}&deg;C</p>
      </div>
      <p className="text-center text-lg capitalize -mt-2 mb-6">{weather.weather[0].description}</p>
      
      <div className="flex justify-around text-center">
        <div>
          <p className="text-sm text-white/70">Humidity</p>
          <p className="text-xl font-semibold">{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-sm text-white/70">Wind Speed</p>
          <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};
