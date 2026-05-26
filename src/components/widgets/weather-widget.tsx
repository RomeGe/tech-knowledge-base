"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

const MOCK_WEATHER: WeatherData = {
  temperature: 22,
  condition: "晴",
  icon: "☀️",
  location: "北京",
};

function getWeatherIcon(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower.includes("rain") || lower.includes("雨")) return "🌧️";
  if (lower.includes("snow") || lower.includes("雪")) return "❄️";
  if (lower.includes("cloud") || lower.includes("云")) return "☁️";
  if (lower.includes("storm") || lower.includes("雷")) return "⛈️";
  if (lower.includes("fog") || lower.includes("雾")) return "🌫️";
  if (lower.includes("sun") || lower.includes("clear") || lower.includes("晴"))
    return "☀️";
  return "🌤️";
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("https://wttr.in/?format=j1");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const current = data.current_condition?.[0];
        if (current) {
          setWeather({
            temperature: parseInt(current.temp_C, 10),
            condition: current.weatherDesc?.[0]?.value || "Unknown",
            icon: getWeatherIcon(current.weatherDesc?.[0]?.value || ""),
            location: data.nearest_area?.[0]?.areaName?.[0]?.value || "Unknown",
          });
        }
      } catch {
        // Use mock data on failure
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <span className="text-4xl">{weather.icon}</span>
      <p className="text-2xl font-semibold text-text-primary">
        {loading ? "--" : weather.temperature}&deg;C
      </p>
      <p className="text-sm text-text-secondary">{weather.condition}</p>
      <p className="text-xs text-text-tertiary">{weather.location}</p>
    </div>
  );
}
