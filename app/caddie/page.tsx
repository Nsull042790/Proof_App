'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '@/components/providers/DataProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface WeatherData {
  temperature: number; // Fahrenheit
  windSpeed: number; // mph
  windDirection: number; // degrees
  humidity: number; // percentage
  conditions: string;
  feelsLike: number;
}

interface ClubData {
  name: string;
  normalDistance: number; // yards
  adjustedDistance?: number;
}

const DEFAULT_CLUBS: ClubData[] = [
  { name: 'Driver', normalDistance: 230 },
  { name: '3 Wood', normalDistance: 215 },
  { name: '5 Wood', normalDistance: 200 },
  { name: '4 Hybrid', normalDistance: 190 },
  { name: '5 Iron', normalDistance: 180 },
  { name: '6 Iron', normalDistance: 170 },
  { name: '7 Iron', normalDistance: 160 },
  { name: '8 Iron', normalDistance: 150 },
  { name: '9 Iron', normalDistance: 140 },
  { name: 'PW', normalDistance: 130 },
  { name: 'GW', normalDistance: 115 },
  { name: 'SW', normalDistance: 100 },
  { name: 'LW', normalDistance: 80 },
];

// Hot Springs Village, AR coordinates
const DEFAULT_LOCATION = {
  lat: 34.6656,
  lon: -93.0535,
  name: 'Hot Springs Village, AR',
  elevation: 800, // feet above sea level
};

export default function CaddiePage() {
  const { data, currentPlayerId } = useData();
  const currentPlayer = currentPlayerId ? data.players.find(p => p.id === currentPlayerId) || null : null;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clubs, setClubs] = useState<ClubData[]>(DEFAULT_CLUBS);
  const [targetYardage, setTargetYardage] = useState<number>(150);
  const [shotDirection, setShotDirection] = useState<number>(0); // degrees, 0 = North
  const [showClubEditor, setShowClubEditor] = useState(false);

  // Fetch weather from Open-Meteo (free, no API key)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${DEFAULT_LOCATION.lat}&longitude=${DEFAULT_LOCATION.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Chicago`
        );

        if (!response.ok) throw new Error('Weather fetch failed');

        const data = await response.json();
        const current = data.current;

        setWeather({
          temperature: Math.round(current.temperature_2m),
          windSpeed: Math.round(current.wind_speed_10m),
          windDirection: current.wind_direction_10m,
          humidity: current.relative_humidity_2m,
          feelsLike: Math.round(current.apparent_temperature),
          conditions: getWeatherCondition(current.weather_code),
        });
        setError(null);
      } catch (err) {
        console.error('Weather error:', err);
        setError('Could not fetch weather');
        // Set mock data for demo
        setWeather({
          temperature: 75,
          windSpeed: 10,
          windDirection: 180,
          humidity: 50,
          feelsLike: 75,
          conditions: 'Clear',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate adjusted distances
  const adjustedClubs = useMemo(() => {
    if (!weather) return clubs;

    return clubs.map((club) => {
      const adjusted = calculateAdjustedDistance(
        club.normalDistance,
        weather,
        DEFAULT_LOCATION.elevation,
        shotDirection
      );
      return { ...club, adjustedDistance: adjusted };
    });
  }, [clubs, weather, shotDirection]);

  // Find recommended club for target yardage
  const recommendedClub = useMemo(() => {
    if (!weather) return null;

    const sorted = [...adjustedClubs].sort((a, b) => {
      const diffA = Math.abs((a.adjustedDistance || a.normalDistance) - targetYardage);
      const diffB = Math.abs((b.adjustedDistance || b.normalDistance) - targetYardage);
      return diffA - diffB;
    });

    return sorted[0];
  }, [adjustedClubs, targetYardage]);

  // Get adjustment factors for display
  const adjustmentFactors = useMemo(() => {
    if (!weather) return null;

    const tempAdjust = calculateTempAdjustment(weather.temperature);
    const windAdjust = calculateWindAdjustment(weather.windSpeed, weather.windDirection, shotDirection);
    const altitudeAdjust = calculateAltitudeAdjustment(DEFAULT_LOCATION.elevation);

    return { tempAdjust, windAdjust, altitudeAdjust };
  }, [weather, shotDirection]);

  const updateClubDistance = (index: number, newDistance: number) => {
    setClubs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], normalDistance: newDistance };
      return updated;
    });
  };

  const getWindDirectionName = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getShotDirectionName = (degrees: number): string => {
    const directions = ['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <span className="text-4xl">🏌️</span>
        <h1 className="text-2xl font-bold text-white mt-2">Smart Caddie</h1>
        <p className="text-[#888888] text-sm">Weather-adjusted club recommendations</p>
      </div>

      {/* Weather Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Current Conditions</h2>
          <span className="text-[#888888] text-xs">{DEFAULT_LOCATION.name}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-[#FFD700]">{weather.temperature}°F</div>
              <div className="text-[#888888] text-xs">Feels like {weather.feelsLike}°F</div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <div className="text-3xl font-bold text-white">{weather.windSpeed}</div>
              <div className="text-[#888888] text-xs">mph {getWindDirectionName(weather.windDirection)}</div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{weather.humidity}%</div>
              <div className="text-[#888888] text-xs">Humidity</div>
            </div>
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{DEFAULT_LOCATION.elevation}ft</div>
              <div className="text-[#888888] text-xs">Elevation</div>
            </div>
          </div>
        ) : (
          <p className="text-[#888888] text-center py-4">{error}</p>
        )}
      </div>

      {/* Shot Direction Selector */}
      <div className="card mb-6">
        <h2 className="text-white font-semibold mb-3">Shot Direction</h2>
        <div className="grid grid-cols-4 gap-2">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((dir) => (
            <button
              key={dir}
              onClick={() => setShotDirection(dir)}
              className={`py-2 rounded-lg text-sm transition-all ${
                shotDirection === dir
                  ? 'bg-[#FFD700] text-black font-bold'
                  : 'bg-[#2a2a2a] text-white'
              }`}
            >
              {getShotDirectionName(dir)}
            </button>
          ))}
        </div>
        {weather && (
          <div className="mt-3 text-center text-sm">
            {calculateWindEffect(weather.windSpeed, weather.windDirection, shotDirection)}
          </div>
        )}
      </div>

      {/* Club Recommendation */}
      <div className="card mb-6">
        <h2 className="text-white font-semibold mb-3">Distance to Target</h2>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="range"
            min="50"
            max="280"
            value={targetYardage}
            onChange={(e) => setTargetYardage(parseInt(e.target.value))}
            className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
          />
          <div className="w-20 text-center">
            <input
              type="number"
              value={targetYardage}
              onChange={(e) => setTargetYardage(parseInt(e.target.value) || 150)}
              className="input text-center text-xl font-bold w-full"
            />
            <span className="text-[#888888] text-xs">yards</span>
          </div>
        </div>

        {recommendedClub && (
          <div className="bg-[#1a472a] border border-[#22c55e] rounded-xl p-4 text-center">
            <div className="text-[#888888] text-xs mb-1">RECOMMENDED</div>
            <div className="text-3xl font-bold text-[#22c55e]">{recommendedClub.name}</div>
            <div className="text-white mt-1">
              {recommendedClub.adjustedDistance} yards adjusted
              <span className="text-[#888888] text-sm ml-2">
                ({recommendedClub.normalDistance} normal)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Adjustment Factors */}
      {adjustmentFactors && (
        <div className="card mb-6">
          <h2 className="text-white font-semibold mb-3">Adjustment Factors</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#888888]">🌡️ Temperature ({weather?.temperature}°F)</span>
              <span className={`font-bold ${adjustmentFactors.tempAdjust >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {adjustmentFactors.tempAdjust >= 0 ? '+' : ''}{adjustmentFactors.tempAdjust.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888888]">💨 Wind ({weather?.windSpeed} mph)</span>
              <span className={`font-bold ${adjustmentFactors.windAdjust >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {adjustmentFactors.windAdjust >= 0 ? '+' : ''}{adjustmentFactors.windAdjust.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#888888]">⛰️ Altitude ({DEFAULT_LOCATION.elevation}ft)</span>
              <span className="font-bold text-[#22c55e]">
                +{adjustmentFactors.altitudeAdjust.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* All Clubs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">All Clubs</h2>
          <button
            onClick={() => setShowClubEditor(!showClubEditor)}
            className="text-[#FFD700] text-sm"
          >
            {showClubEditor ? 'Done' : 'Edit Distances'}
          </button>
        </div>

        <div className="space-y-2">
          {adjustedClubs.map((club, idx) => (
            <div
              key={club.name}
              className={`flex items-center justify-between p-3 rounded-lg ${
                recommendedClub?.name === club.name
                  ? 'bg-[#1a472a] border border-[#22c55e]'
                  : 'bg-[#2a2a2a]'
              }`}
            >
              <span className={`font-medium ${
                recommendedClub?.name === club.name ? 'text-[#22c55e]' : 'text-white'
              }`}>
                {club.name}
              </span>
              {showClubEditor ? (
                <input
                  type="number"
                  value={club.normalDistance}
                  onChange={(e) => updateClubDistance(idx, parseInt(e.target.value) || 0)}
                  className="input w-20 text-center text-sm"
                />
              ) : (
                <div className="text-right">
                  <span className={`font-bold ${
                    recommendedClub?.name === club.name ? 'text-[#22c55e]' : 'text-[#FFD700]'
                  }`}>
                    {club.adjustedDistance}
                  </span>
                  <span className="text-[#666666] text-sm ml-2">
                    ({club.normalDistance})
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-[#1a1a1a] rounded-xl">
        <p className="text-[#666666] text-xs text-center">
          💡 Adjust your normal club distances above for more accurate recommendations.
          The algorithm accounts for temperature, wind, and altitude.
        </p>
      </div>
    </div>
  );
}

// Helper functions

function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

function calculateTempAdjustment(temp: number): number {
  // Ball travels ~2 yards less per 10°F below 70°F
  // And ~2 yards more per 10°F above 70°F
  // This is roughly 1.3% per 10°F
  const baseline = 70;
  const diff = temp - baseline;
  return (diff / 10) * 1.3;
}

function calculateWindAdjustment(
  windSpeed: number,
  windDirection: number,
  shotDirection: number
): number {
  // Calculate angle between wind and shot direction
  // 0 = tailwind (same direction), 180 = headwind (opposite)
  const angleDiff = Math.abs(windDirection - shotDirection);
  const effectiveAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;

  // Convert to radians and calculate headwind/tailwind component
  const angleRad = (effectiveAngle * Math.PI) / 180;
  const windEffect = Math.cos(angleRad);

  // Roughly 1% per mph for headwind, 0.5% per mph for tailwind
  // Negative windEffect = headwind, Positive = tailwind
  if (windEffect > 0) {
    // Tailwind - adds distance
    return windSpeed * windEffect * 0.5;
  } else {
    // Headwind - reduces distance
    return windSpeed * windEffect * 1.0;
  }
}

function calculateAltitudeAdjustment(elevation: number): number {
  // Ball travels ~2% farther per 1000ft of elevation
  return (elevation / 1000) * 2;
}

function calculateAdjustedDistance(
  normalDistance: number,
  weather: WeatherData,
  elevation: number,
  shotDirection: number
): number {
  const tempAdj = calculateTempAdjustment(weather.temperature);
  const windAdj = calculateWindAdjustment(weather.windSpeed, weather.windDirection, shotDirection);
  const altAdj = calculateAltitudeAdjustment(elevation);

  const totalAdjustment = 1 + (tempAdj + windAdj + altAdj) / 100;
  return Math.round(normalDistance * totalAdjustment);
}

function calculateWindEffect(
  windSpeed: number,
  windDirection: number,
  shotDirection: number
): React.ReactNode {
  const angleDiff = Math.abs(windDirection - shotDirection);
  const effectiveAngle = angleDiff > 180 ? 360 - angleDiff : angleDiff;

  let description: string;
  let color: string;

  if (effectiveAngle < 45) {
    description = `🎯 Tailwind - Ball will fly ${Math.round(windSpeed * 0.5)}+ yards farther`;
    color = 'text-[#22c55e]';
  } else if (effectiveAngle < 90) {
    description = `↗️ Quartering tailwind - Slight distance boost`;
    color = 'text-[#22c55e]';
  } else if (effectiveAngle < 135) {
    description = `↘️ Quartering headwind - Slight distance loss`;
    color = 'text-[#f59e0b]';
  } else {
    description = `🌬️ Headwind - Ball will fly ${Math.round(windSpeed * 1)}+ yards shorter`;
    color = 'text-[#ef4444]';
  }

  return <span className={color}>{description}</span>;
}
