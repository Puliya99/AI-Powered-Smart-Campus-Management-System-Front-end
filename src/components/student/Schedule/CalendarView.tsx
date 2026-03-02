import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen, ClipboardList, Star, Calendar, Clock, X } from 'lucide-react';

interface Event {
  id: string;
  date: string;
  title: string;
  type: 'class' | 'assignment' | 'event';
  moduleCode?: string;
  time?: string;
}

interface CalendarViewProps {
  events: Event[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  const formatFullDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];
  const selectedClasses = selectedDayEvents.filter(e => e.type === 'class');
  const selectedEvents = selectedDayEvents.filter(e => e.type === 'event');
  const selectedAssignments = selectedDayEvents.filter(e => e.type === 'assignment');

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {days.map(day => (
          <div key={day} className="py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    return (
      <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-gray-200 gap-px border-b border-gray-200 overflow-hidden">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isSelected = selectedDay && isSameDay(day, selectedDay);

          const hasClasses = dayEvents.some(e => e.type === 'class');
          const hasEvents = dayEvents.some(e => e.type === 'event');
          const hasAssignments = dayEvents.some(e => e.type === 'assignment');

          return (
            <div
              key={idx}
              onClick={() => {
                if (dayEvents.length > 0) {
                  setSelectedDay(isSelected ? null : day);
                }
              }}
              className={`bg-white p-2 flex flex-col space-y-1 transition-colors ${
                !isSelectedMonth ? 'bg-gray-50 text-gray-400' : 'text-gray-900'
              } ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-gray-50' : ''} ${
                isSelected ? 'ring-2 ring-inset ring-primary-500 bg-primary-50' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                    isToday(day) ? 'bg-primary-600 text-white' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {/* Colored dots indicating activity types */}
                  <div className="flex gap-0.5">
                    {hasClasses && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    {hasEvents && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                    {hasAssignments && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1 overflow-y-auto max-h-24 custom-scrollbar">
                {dayEvents.map(event => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={`text-[10px] p-1 rounded border leading-tight flex flex-col ${
                      event.type === 'class'
                        ? 'bg-blue-50 border-blue-100 text-blue-700'
                        : event.type === 'event'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-orange-50 border-orange-100 text-orange-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1 font-bold truncate">
                      {event.type === 'class' ? (
                        <BookOpen className="h-2 w-2 flex-shrink-0" />
                      ) : event.type === 'event' ? (
                        <Star className="h-2 w-2 flex-shrink-0" />
                      ) : (
                        <ClipboardList className="h-2 w-2 flex-shrink-0" />
                      )}
                      <span>{event.moduleCode || event.title}</span>
                    </div>
                    <span className="truncate">{event.title}</span>
                    {event.time && <span className="text-[9px] opacity-75">{event.time}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSelectedDayDetails = () => {
    if (!selectedDay || selectedDayEvents.length === 0) return null;

    return (
      <div className="border-t border-gray-200 bg-white p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            <h3 className="text-base font-bold text-gray-900">
              {formatFullDate(selectedDay)}
            </h3>
          </div>
          <button
            onClick={() => setSelectedDay(null)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Classes */}
          {selectedClasses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Classes ({selectedClasses.length})
                </span>
              </div>
              {selectedClasses.map(event => (
                <div key={event.id} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-800">{event.title}</span>
                  </div>
                  {event.moduleCode && (
                    <p className="text-xs text-blue-600 mb-1">{event.moduleCode}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Events */}
          {selectedEvents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Events ({selectedEvents.length})
                </span>
              </div>
              {selectedEvents.map(event => (
                <div key={event.id} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-800">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  {event.time && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Assignments */}
          {selectedAssignments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Assignments ({selectedAssignments.length})
                </span>
              </div>
              {selectedAssignments.map(event => (
                <div key={event.id} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-800">{event.title}</span>
                  </div>
                  {event.moduleCode && (
                    <p className="text-xs text-orange-600 mb-1">{event.moduleCode}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* Selected day detail panel */}
      {renderSelectedDayDetails()}

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
          <span className="text-gray-600">Classes</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2" />
          <span className="text-gray-600">Events</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-orange-500 mr-2" />
          <span className="text-gray-600">Assignments</span>
        </div>
        <span className="text-gray-400 ml-auto hidden sm:block">Click a date to see details</span>
      </div>
    </div>
  );
};

export default CalendarView;
