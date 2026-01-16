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
import { ChevronLeft, ChevronRight, BookOpen, ClipboardList } from 'lucide-react';

interface Event {
  id: string;
  date: string;
  title: string;
  type: 'class' | 'assignment';
  moduleCode: string;
  time?: string;
}

interface CalendarViewProps {
  events: Event[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-gray-200 gap-px border-b border-gray-200 overflow-hidden rounded-b-xl">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={idx}
              className={`bg-white p-2 flex flex-col space-y-1 transition-colors ${
                !isSelectedMonth ? 'bg-gray-50 text-gray-400' : 'text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${
                  isToday(day) ? 'bg-primary-600 text-white' : ''
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              <div className="flex flex-col space-y-1 overflow-y-auto max-h-24 custom-scrollbar">
                {dayEvents.map(event => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={`text-[10px] p-1 rounded border leading-tight flex flex-col ${
                      event.type === 'class'
                        ? 'bg-blue-50 border-blue-100 text-blue-700'
                        : 'bg-orange-50 border-orange-100 text-orange-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1 font-bold truncate">
                      {event.type === 'class' ? (
                        <BookOpen className="h-2 w-2 flex-shrink-0" />
                      ) : (
                        <ClipboardList className="h-2 w-2 flex-shrink-0" />
                      )}
                      <span>{event.moduleCode}</span>
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex space-x-6 text-xs font-medium">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded bg-blue-50 border border-blue-100 mr-2"></div>
          <span className="text-gray-600">Classes</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded bg-orange-50 border border-orange-100 mr-2"></div>
          <span className="text-gray-600">Assignments</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
