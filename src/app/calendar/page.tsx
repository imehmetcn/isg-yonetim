"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { tr } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  status: string;
  category: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
      const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");

      const response = await fetch(`/api/calendar?start=${startDate}&end=${endDate}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Etkinlikler yüklenemedi");
      }

      setEvents(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function getEventTypeColor(type: string): string {
    switch (type) {
      case "TASK":
        return "bg-blue-100 text-blue-800";
      case "TRAINING":
        return "bg-green-100 text-green-800";
      case "AUDIT":
        return "bg-yellow-100 text-yellow-800";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getEventTypeText(type: string): string {
    switch (type) {
      case "TASK":
        return "Görev";
      case "TRAINING":
        return "Eğitim";
      case "AUDIT":
        return "Denetim";
      case "MAINTENANCE":
        return "Bakım";
      default:
        return "Diğer";
    }
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
            }
            className="p-2 rounded-md hover:bg-gray-100"
          >
            ←
          </button>
          <span className="text-lg font-medium">
            {format(currentDate, "MMMM yyyy", { locale: tr })}
          </span>
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
            }
            className="p-2 rounded-md hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map(day => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {daysInMonth.map(date => {
            const dayEvents = events.filter(
              event => format(new Date(event.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
            );

            return (
              <div
                key={date.toString()}
                className={`min-h-32 bg-white p-2 ${
                  !isSameMonth(date, currentDate) ? "bg-gray-50" : ""
                } ${isToday(date) ? "bg-blue-50" : ""}`}
              >
                <div className="font-medium text-sm text-gray-500">{format(date, "d")}</div>
                <div className="mt-1 space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`px-2 py-1 text-xs rounded-md ${getEventTypeColor(event.type)}`}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs opacity-75">{getEventTypeText(event.type)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
