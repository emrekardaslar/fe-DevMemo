import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface DayProps {
  hasEntry: boolean;
  isHighlight: boolean;
  isToday: boolean;
}

const CalendarContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CalendarHeader = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: var(--text-color);
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayName = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const Day = styled(Link)<DayProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: ${props => props.isToday ? '600' : '400'};
  text-decoration: none;
  cursor: ${props => props.hasEntry ? 'pointer' : 'default'};
  color: ${props => {
    if (props.isToday) return 'white';
    return props.hasEntry ? 'var(--text-color)' : 'var(--text-secondary)';
  }};
  background-color: ${props => {
    if (props.isToday) return 'var(--primary-color)';
    if (props.isHighlight) return 'rgba(52, 152, 219, 0.2)';
    return props.hasEntry ? 'rgba(52, 152, 219, 0.1)' : 'transparent';
  }};
  border: ${props => 
    props.hasEntry && !props.isToday 
      ? '1px solid rgba(52, 152, 219, 0.3)' 
      : props.isToday 
        ? '1px solid var(--primary-color)' 
        : '1px solid var(--border-color)'
  };
  
  &:hover {
    background-color: ${props => {
      if (props.isToday) return 'var(--primary-color-dark)';
      return props.hasEntry ? 'rgba(52, 152, 219, 0.2)' : 'transparent';
    }};
  }
`;

const EmptyDay = styled.div`
  height: 2.5rem;
`;

interface WeekCalendarProps {
  startDate: string;
  dates: string[];
  highlights: string[];
}

interface DayData {
  date: string;
  day: number;
  weekday: string;
  hasEntry: boolean;
  isHighlight: boolean;
  isToday: boolean;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  startDate,
  dates,
  highlights
}) => {
  // Check if a date has an entry
  const hasEntry = (date: string) => dates.includes(date);
  
  // Check if a date is a highlight
  const isHighlight = (date: string) => highlights.includes(date);
  
  // Check if a date is today
  const isToday = (date: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return date === todayStr;
  };
  
  // Generate days for the week
  const generateDays = (): DayData[] => {
    const days: DayData[] = [];
    const start = new Date(startDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Generate days for the current week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const weekdayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
      
      days.push({
        date: dateStr,
        day: currentDate.getDate(),
        weekday: dayNames[weekdayIndex],
        hasEntry: hasEntry(dateStr),
        isHighlight: isHighlight(dateStr),
        isToday: isToday(dateStr)
      });
    }
    
    return days;
  };
  
  const days = generateDays();
  
  return (
    <CalendarContainer>
      <CalendarHeader>Week at a Glance</CalendarHeader>
      <WeekGrid>
        {/* Render the day names from the calculated days */}
        {days.map((day) => (
          <DayName key={`day-name-${day.date}`}>{day.weekday}</DayName>
        ))}
        
        {days.map((day) => (
          day.hasEntry ? (
            <Day
              key={day.date}
              to={`/standups/${day.date}`}
              hasEntry={day.hasEntry}
              isHighlight={day.isHighlight}
              isToday={day.isToday}
              title={`View standup for ${new Date(day.date).toLocaleDateString()}`}
            >
              {day.day}
            </Day>
          ) : (
            <Day
              key={day.date}
              to="#"
              onClick={(e) => e.preventDefault()}
              hasEntry={day.hasEntry}
              isHighlight={day.isHighlight}
              isToday={day.isToday}
            >
              {day.day}
            </Day>
          )
        ))}
      </WeekGrid>
    </CalendarContainer>
  );
};

export default WeekCalendar; 