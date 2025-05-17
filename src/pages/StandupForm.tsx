import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useStandups, Standup, CreateStandupDto, UpdateStandupDto } from '../context/StandupContext';
import { useStandupOperations } from '../hooks/useStandupOperations';
import TagSelector from '../components/standups/TagSelector';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
`;

const Form = styled.form`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const TagDeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: var(--error-color);
  }
`;

const TagInput = styled.input`
  width: auto;
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const RatingLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const RatingOptions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const RatingOption = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  background-color: ${props => props.selected ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  color: ${props => props.selected ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: var(--primary-color);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--text-secondary);
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 1rem;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
`;

const ToggleSwitch = styled.div<{ checked: boolean }>`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 20px;
  margin-right: 0.75rem;
  transition: background-color 0.2s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  label:hover & {
    border: ${props => props.checked ? 'none' : '1px solid var(--primary-color)'};
  }
`;

const WarningMessage = styled.div`
  color: var(--warning-color);
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(241, 196, 15, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const WarningIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--error-color);
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelModalButton = styled.button`
  background-color: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ConfirmModalButton = styled.button`
  background-color: var(--error-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const StandupForm: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  
  const { currentStandup, loading, error, success } = useStandups();
  const { loadStandup, createStandup, updateStandup, clearCurrentStandup, resetSuccessState } = useStandupOperations();
  
  const isEditing = !!date;
  
  // Form state
  const [formData, setFormData] = useState<CreateStandupDto>({
    date: new Date().toISOString().split('T')[0],
    yesterday: '',
    today: '',
    blockers: '',
    isBlockerResolved: false,
    tags: [],
    mood: 3,
    productivity: 3,
    isHighlight: false
  });
  
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Fetch standup data when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      resetSuccessState();
      
      if (isEditing && date) {
        try {
          await loadStandup(date);
        } catch (error) {
          console.error('Error loading standup:', error);
        }
      } else {
        // If creating new standup, clear any existing one
        clearCurrentStandup();
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, isEditing]); // Only re-run when date or isEditing changes
  
  // Populate form with current standup data when available
  useEffect(() => {
    if (currentStandup && Object.keys(currentStandup).length > 0) {
      setFormData({
        date: currentStandup.date,
        yesterday: currentStandup.yesterday || '',
        today: currentStandup.today || '',
        blockers: currentStandup.blockers || '',
        isBlockerResolved: !!currentStandup.isBlockerResolved,
        tags: Array.isArray(currentStandup.tags) ? currentStandup.tags : [],
        mood: currentStandup.mood || 3,
        productivity: currentStandup.productivity || 3,
        isHighlight: !!currentStandup.isHighlight
      });
    }
  }, [currentStandup]);
  
  // Check for existing standup when date changes
  useEffect(() => {
    // Only set warning if we're in create mode and have a standup with the same date
    if (!isEditing && currentStandup && currentStandup.date === formData.date) {
      setShowOverwriteWarning(true);
    } else {
      setShowOverwriteWarning(false);
    }
  }, [currentStandup, formData.date, isEditing]);
  
  // Redirect after successful submission
  useEffect(() => {
    if (success) {
      navigate('/standups');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Update handler for TagSelector
  const handleTagsChange = (newTags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };
  
  const handleToggleHighlight = () => {
    console.log('Toggle highlight clicked. Current value:', formData.isHighlight);
    setFormData(prev => {
      const newValue = !prev.isHighlight;
      console.log('Setting isHighlight to:', newValue);
      return {
        ...prev,
        isHighlight: newValue
      };
    });
  };
  
  const handleSetRating = (type: 'mood' | 'productivity', value: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const handleToggleBlockerResolved = () => {
    setFormData(prev => ({
      ...prev,
      isBlockerResolved: !prev.isBlockerResolved
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.yesterday.trim()) {
      errors.yesterday = 'Please enter what you did yesterday';
    }
    
    if (!formData.today.trim()) {
      errors.today = 'Please enter what you plan to do today';
    }
    
    // Add validation for mood and productivity based on backend requirements
    if (formData.mood !== 0 && (formData.mood < 1 || formData.mood > 5)) {
      errors.mood = 'Mood rating must be between 1 and 5';
    }
    
    if (formData.productivity !== 0 && (formData.productivity < 1 || formData.productivity > 5)) {
      errors.productivity = 'Productivity rating must be between 1 and 5';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (showOverwriteWarning) {
      if (window.confirm('A standup for this date already exists. Do you want to overwrite it?')) {
        submitForm();
      }
    } else {
      submitForm();
    }
  };
  
  const submitForm = async () => {
    try {
      if (isEditing && date) {
        await updateStandup(date, formData, true);
      } else {
        await createStandup(formData, true);
      }
      resetSuccessState();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const handleCancel = () => {
    clearCurrentStandup();
    navigate('/standups');
  };
  
  // Helper to render rating options
  const renderRatingOptions = (type: 'mood' | 'productivity', maxValue: number = 5) => {
    // Add an option for "Not rated" (value 0)
    return (
      <>
        <RatingOption 
          key={0}
          type="button"
          selected={formData[type] === 0}
          onClick={() => handleSetRating(type, 0)}
        >
          N/A
        </RatingOption>
        {Array.from({ length: maxValue }, (_, i) => i + 1).map(value => (
          <RatingOption 
            key={value}
            type="button"
            selected={formData[type] === value}
            onClick={() => handleSetRating(type, value)}
          >
            {value}
          </RatingOption>
        ))}
      </>
    );
  };

  return (
    <FormContainer>
      <PageHeader>
        <Title>{isEditing ? 'Edit Standup' : 'New Standup'}</Title>
        <Subtitle>{isEditing ? 'Update your standup entry' : 'Create a new standup entry'}</Subtitle>
      </PageHeader>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isEditing}
          />
          {formErrors.date && <ErrorMessage>{formErrors.date}</ErrorMessage>}
          {showOverwriteWarning && !isEditing && (
            <WarningMessage>
              <WarningIcon>⚠️</WarningIcon>
              A standup entry already exists for this date. Creating a new one will overwrite it.
            </WarningMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="yesterday">What did you accomplish yesterday?</Label>
          <Textarea
            id="yesterday"
            name="yesterday"
            value={formData.yesterday}
            onChange={handleChange}
            placeholder="* Fixed bug in authentication flow&#10;* Implemented new dashboard UI&#10;* Reviewed PR from team"
          />
          {formErrors.yesterday && <ErrorMessage>{formErrors.yesterday}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="today">What will you do today?</Label>
          <Textarea
            id="today"
            name="today"
            value={formData.today}
            onChange={handleChange}
            placeholder="* Complete the API integration&#10;* Start working on the analytics feature&#10;* Prepare for the demo"
          />
          {formErrors.today && <ErrorMessage>{formErrors.today}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="blockers">Any blockers or challenges?</Label>
          <Textarea
            id="blockers"
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            placeholder="* Waiting for access to the staging environment&#10;* Need clarification on design specs"
          />
          
          {formData.blockers && formData.blockers.trim() !== '' && (
            <ToggleContainer>
              <ToggleLabel htmlFor="blocker-resolved-toggle">
                <ToggleSwitch checked={formData.isBlockerResolved} />
                Mark blocker as resolved
              </ToggleLabel>
              <input
                id="blocker-resolved-toggle"
                type="checkbox"
                style={{ display: 'none' }}
                checked={formData.isBlockerResolved}
                onChange={handleToggleBlockerResolved}
              />
            </ToggleContainer>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagSelector 
            selectedTags={formData.tags} 
            onTagsChange={handleTagsChange} 
          />
        </FormGroup>
        
        <RatingContainer>
          <RatingLabel>How was your mood today?</RatingLabel>
          <RatingOptions>
            {renderRatingOptions('mood')}
          </RatingOptions>
          {formErrors.mood && <ErrorMessage>{formErrors.mood}</ErrorMessage>}
        </RatingContainer>
        
        <RatingContainer>
          <RatingLabel>How productive were you?</RatingLabel>
          <RatingOptions>
            {renderRatingOptions('productivity')}
          </RatingOptions>
          {formErrors.productivity && <ErrorMessage>{formErrors.productivity}</ErrorMessage>}
        </RatingContainer>
        
        <ToggleContainer>
          <ToggleLabel htmlFor="highlight-toggle">
            <ToggleSwitch checked={formData.isHighlight} />
            Mark as highlight
          </ToggleLabel>
          <input
            id="highlight-toggle"
            type="checkbox"
            style={{ display: 'none' }}
            checked={formData.isHighlight}
            onChange={handleToggleHighlight}
          />
        </ToggleContainer>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ButtonContainer>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Standup' : 'Create Standup')}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
};

export default StandupForm; 