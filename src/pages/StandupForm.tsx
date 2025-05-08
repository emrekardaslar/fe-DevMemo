import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchStandup, createStandup, updateStandup, clearStandup, resetSuccess, fetchStandups } from '../redux/standups/actions';
import { RootState } from '../redux/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { Standup, CreateStandupDto, UpdateStandupDto } from '../redux/standups/types';
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
`;

const ToggleSwitch = styled.div<{ checked: boolean }>`
  position: relative;
  width: 40px;
  height: 20px;
  background-color: ${props => props.checked ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 20px;
  margin-right: 0.75rem;
  transition: background-color 0.2s;
  
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
  const dispatch = useAppDispatch();
  const { currentStandup, standups, loading, error, success } = useSelector((state: RootState) => state.standups);

  
  const [formData, setFormData] = useState<CreateStandupDto>({
    date: new Date().toISOString().split('T')[0], // Default to today
    yesterday: '',
    today: '',
    blockers: '',
    tags: [],
    mood: 0,
    productivity: 0,
    isHighlight: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const isEditMode = Boolean(date);
  
  // Fetch all standups for existing date check
  useEffect(() => {
    if (!isEditMode) {
      dispatch(fetchStandups());
    }
  }, [dispatch, isEditMode]);
  
  // Fetch standup data when in edit mode
  useEffect(() => {
    if (isEditMode && date) {
      dispatch(fetchStandup(date));
    } else {
      dispatch(clearStandup());
    }
    
    return () => {
      dispatch(clearStandup());
      dispatch(resetSuccess());
    };
  }, [dispatch, isEditMode, date]);
  
  // Update form data when currentStandup changes
  useEffect(() => {
    if (currentStandup && isEditMode) {
      setFormData({
        date: currentStandup.date,
        yesterday: currentStandup.yesterday,
        today: currentStandup.today,
        blockers: currentStandup.blockers,
        tags: currentStandup.tags || [],
        mood: currentStandup.mood,
        productivity: currentStandup.productivity,
        isHighlight: currentStandup.isHighlight
      });
    }
  }, [currentStandup, isEditMode]);
  
  // Redirect on success
  useEffect(() => {
    if (success) {
      if (isEditMode) {
        navigate(`/standups/${formData.date}`);
      } else {
        navigate('/standups');
      }
      dispatch(resetSuccess());
    }
  }, [success, navigate, dispatch, isEditMode, formData.date]);
  
  // Check if standup already exists for selected date
  useEffect(() => {
    if (!isEditMode && standups.length > 0) {
      const existingStandup = standups.find(s => s.date === formData.date);
      setShowOverwriteWarning(!!existingStandup);
    } else {
      setShowOverwriteWarning(false);
    }
  }, [formData.date, standups, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
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
    setFormData(prev => ({
      ...prev,
      isHighlight: !prev.isHighlight
    }));
  };
  
  const handleSetRating = (type: 'mood' | 'productivity', value: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
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
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    // Check if we need to show the overwrite confirmation
    if (!isEditMode && showOverwriteWarning) {
      setShowOverwriteModal(true);
      return;
    }
    
    submitForm();
  };
  
  const submitForm = () => {
    // Prepare submission data
    const submissionData: CreateStandupDto | UpdateStandupDto = {
      ...formData
    };
    
    // If mood or productivity is 0 (not rated), don't send it to the backend
    if (formData.mood === 0) {
      delete submissionData.mood;
    }
    
    if (formData.productivity === 0) {
      delete submissionData.productivity;
    }
    
    if (!validateForm()) {
      console.log('Validation failed, errors:', validationErrors);
      return;
    }
    
    if (isEditMode && date) {
      console.log('Updating standup:', submissionData);
      dispatch(updateStandup(date, submissionData as UpdateStandupDto));
    } else {
      console.log('Creating standup:', submissionData);
      dispatch(createStandup(submissionData as CreateStandupDto));
    }
    
    // Close the modal if it was open
    setShowOverwriteModal(false);
  };
  
  const handleCancel = () => {
    if (isEditMode && date) {
      navigate(`/standups/${date}`);
    } else {
      navigate('/standups');
    }
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
        <Title>{isEditMode ? 'Edit Standup' : 'New Standup'}</Title>
        <Subtitle>{isEditMode ? 'Update your standup entry' : 'Create a new standup entry'}</Subtitle>
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
            disabled={isEditMode}
          />
          {validationErrors.date && <ErrorMessage>{validationErrors.date}</ErrorMessage>}
          {showOverwriteWarning && !isEditMode && (
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
          {validationErrors.yesterday && <ErrorMessage>{validationErrors.yesterday}</ErrorMessage>}
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
          {validationErrors.today && <ErrorMessage>{validationErrors.today}</ErrorMessage>}
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
          {validationErrors.mood && <ErrorMessage>{validationErrors.mood}</ErrorMessage>}
        </RatingContainer>
        
        <RatingContainer>
          <RatingLabel>How productive were you?</RatingLabel>
          <RatingOptions>
            {renderRatingOptions('productivity')}
          </RatingOptions>
          {validationErrors.productivity && <ErrorMessage>{validationErrors.productivity}</ErrorMessage>}
        </RatingContainer>
        
        <ToggleContainer>
          <ToggleLabel>
            <ToggleSwitch checked={formData.isHighlight} />
            Mark as highlight
          </ToggleLabel>
          <input
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
            {loading ? 'Saving...' : (isEditMode ? 'Update Standup' : 'Create Standup')}
          </SubmitButton>
        </ButtonContainer>
      </Form>
      
      {/* Overwrite Confirmation Modal */}
      {showOverwriteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Warning: Overwrite Existing Standup</ModalTitle>
            <ModalText>
              A standup entry already exists for {formData.date}. 
              If you continue, the existing entry will be permanently overwritten.
              Are you sure you want to proceed?
            </ModalText>
            <ModalButtons>
              <CancelModalButton onClick={() => setShowOverwriteModal(false)}>
                Cancel
              </CancelModalButton>
              <ConfirmModalButton onClick={submitForm}>
                Overwrite
              </ConfirmModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </FormContainer>
  );
};

export default StandupForm; 