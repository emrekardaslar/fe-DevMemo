import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Use $ prefix for props that shouldn't be passed to the DOM
interface StyledDayProps {
  $hasEntry: boolean;
  $isHighlight: boolean;
  $isToday: boolean;
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

const Day = styled(Link)<StyledDayProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: ${props => props.$isToday ? '600' : '400'};
  text-decoration: none;
  cursor: ${props => props.$hasEntry ? 'pointer' : 'default'};
  color: ${props => {
    if (props.$isToday) return 'white';
    return props.$hasEntry ? 'var(--text-color)' : 'var(--text-secondary)';
  }};
  background-color: ${props => {
    if (props.$isToday) return 'var(--primary-color)';
    if (props.$isHighlight) return 'rgba(52, 152, 219, 0.2)';
    return props.$hasEntry ? 'rgba(52, 152, 219, 0.1)' : 'transparent';
  }};
  border: ${props => 
    props.$hasEntry && !props.$isToday 
      ? '1px solid rgba(52, 152, 219, 0.3)' 
      : props.$isToday 
        ? '1px solid var(--primary-color)' 
        : '1px solid var(--border-color)'
  };
  
  &:hover {
    background-color: ${props => {
      if (props.$isToday) return 'var(--primary-color-dark)';
      return props.$hasEntry ? 'rgba(52, 152, 219, 0.2)' : 'transparent';
    }};
  }
`;

const EmptyDay = styled.div`
  height: 2.5rem;
`;

const DebugSection = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow: auto;
  max-height: 300px;
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
  startDate = new Date().toISOString().split('T')[0],
  dates = [],
  highlights = []
}) => {
  // Add debugging effect
  useEffect(() => {
    console.log("WeekCalendar Props:", { startDate, dates, highlights });
  }, [startDate, dates, highlights]);

  // Check if a date has an entry
  const hasEntry = (date: string) => {
    // Ensure dates is an array
    if (!Array.isArray(dates) || dates.length === 0) {
      console.log(`No standup dates provided for check: ${date}`);
      return false;
    }
    
    // Check if the date string is in the dates array
    // Need to normalize both the date and the entries in dates array
    // to ensure consistent format for comparison
    const normalizedDate = date;
    const result = dates.some(entryDate => entryDate === normalizedDate);
    console.log(`Checking if date ${date} has entry: ${result}`, { 
      date, 
      normalizedDate,
      dates: dates.join(', ')
    });
    return result;
  };
  
  // Check if a date is a highlight
  const isHighlight = (date: string) => {
    // Ensure highlights is an array
    if (!Array.isArray(highlights) || highlights.length === 0) {
      console.log(`No highlights provided for check: ${date}`);
      return false;
    }
    
    // Check if the date string is in the highlights array
    const result = highlights.some(highlightDate => highlightDate === date);
    console.log(`Checking if date ${date} is highlight: ${result}`, { 
      date, 
      highlights: highlights.join(', ')
    });
    return result;
  };
  
  // Check if a date is today
  const isToday = (date: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const result = date === todayStr;
    console.log(`Checking if date ${date} is today (${todayStr}): ${result}`);
    return result;
  };
  
  // Generate days for the week
  const generateDays = (): DayData[] => {
    const days: DayData[] = [];
    
    try {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        console.error("Invalid startDate provided:", startDate);
        return [];
      }
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Generate days for the current week
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        const weekdayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        
        const entryExists = hasEntry(dateStr);
        const isHighlighted = isHighlight(dateStr);
        const isTodayDate = isToday(dateStr);
        
        days.push({
          date: dateStr,
          day: currentDate.getDate(),
          weekday: dayNames[weekdayIndex],
          hasEntry: entryExists,
          isHighlight: isHighlighted,
          isToday: isTodayDate
        });
      }
    } catch (error) {
      console.error("Error generating days:", error);
    }
    
    return days;
  };
  
  const days = generateDays();
  
  // Debug the generated days
  useEffect(() => {
    console.log("Generated Days:", days);
  }, [days]);

  // Count how many days have entries to verify data
  const daysWithEntries = days.filter(day => day.hasEntry).length;

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
              $hasEntry={day.hasEntry}
              $isHighlight={day.isHighlight}
              $isToday={day.isToday}
              title={`View standup for ${new Date(day.date).toLocaleDateString()}`}
            >
              {day.day}
            </Day>
          ) : (
            <Day
              key={day.date}
              to="#"
              onClick={(e) => e.preventDefault()}
              $hasEntry={false}
              $isHighlight={false}
              $isToday={day.isToday}
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