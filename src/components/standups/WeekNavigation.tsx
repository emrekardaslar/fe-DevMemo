import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-right: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-color-dark);
  }

  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
  width: 2.25rem;
  height: 2.25rem;
`;

const DateRangeDisplay = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
`;

const DatePickerContainer = styled.div`
  position: relative;
`;

const DatePickerInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  width: 150px;
  cursor: pointer;
  background-color: white;
  
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const CalendarIcon = styled(FaCalendarAlt)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
`;

interface WeekNavigationProps {
  startDate: string;
  endDate: string;
  onWeekChange: (newStartDate: string, newEndDate: string) => void;
}

const WeekNavigation: React.FC<WeekNavigationProps> = ({ 
  startDate, 
  endDate, 
  onWeekChange 
}) => {
  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Move to previous week
  const handlePreviousWeek = () => {
    const start = new Date(startDate);
    start.setDate(start.getDate() - 7);
    
    const end = new Date(endDate);
    end.setDate(end.getDate() - 7);
    
    onWeekChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  // Move to next week
  const handleNextWeek = () => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + 7);
    
    const end = new Date(endDate);
    end.setDate(end.getDate() + 7);
    
    onWeekChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  // Reset to current week
  const handleCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    onWeekChange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    );
  };

  // Handle date picker change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    
    // Calculate the start of the week for the selected date
    const dayOfWeek = selectedDate.getDay();
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
    
    // Calculate the end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    onWeekChange(
      startOfWeek.toISOString().split('T')[0],
      endOfWeek.toISOString().split('T')[0]
    );
  };

  // Check if current week is selected
  const isCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - dayOfWeek);
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekStartStr = currentWeekStart.toISOString().split('T')[0];
    return currentWeekStartStr === startDate;
  };

  return (
    <NavigationContainer>
      <NavigationButtons>
        <IconButton onClick={handlePreviousWeek} title="Previous Week">
          <FaChevronLeft />
        </IconButton>
        <Button 
          onClick={handleCurrentWeek} 
          disabled={isCurrentWeek()}
          title="Current Week"
        >
          This Week
        </Button>
        <IconButton onClick={handleNextWeek} title="Next Week">
          <FaChevronRight />
        </IconButton>
      </NavigationButtons>
      
      <DateRangeDisplay>
        {formatDateForDisplay(startDate)} - {formatDateForDisplay(endDate)}
      </DateRangeDisplay>
      
      <DatePickerContainer>
        <DatePickerInput 
          type="date"
          onChange={handleDateChange}
          value={startDate}
          title="Select Week"
        />
        <CalendarIcon />
      </DatePickerContainer>
    </NavigationContainer>
  );
};

export default WeekNavigation; 