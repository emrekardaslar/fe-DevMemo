import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchStandup, createStandup, updateStandup, clearStandup, resetSuccess } from '../redux/standups/actions';
import { RootState } from '../redux/store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { Standup } from '../redux/standups/types';

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

const StandupForm: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStandup, loading, error, success } = useSelector((state: RootState) => state.standups);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today
    yesterday: '',
    today: '',
    blockers: '',
    tags: [] as string[],
    mood: 0,
    productivity: 0,
    isHighlight: false
  });
  const [tagInput, setTagInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const isEditing = !!date;
  
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchStandup(date));
    } else {
      dispatch(clearStandup());
    }
    
    return () => {
      dispatch(resetSuccess());
    };
  }, [dispatch, date, isEditing]);
  
  useEffect(() => {
    if (currentStandup && isEditing) {
      setFormData({
        date: currentStandup.date,
        yesterday: currentStandup.yesterday,
        today: currentStandup.today,
        blockers: currentStandup.blockers,
        tags: [...currentStandup.tags],
        mood: currentStandup.mood,
        productivity: currentStandup.productivity,
        isHighlight: currentStandup.isHighlight
      });
    }
  }, [currentStandup, isEditing]);
  
  useEffect(() => {
    if (success) {
      navigate('/standups');
    }
  }, [success, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/\s+/g, '_');
      
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
    const errors: string[] = [];
    
    if (!formData.date) {
      errors.push('Date is required');
    }
    
    if (!formData.yesterday.trim()) {
      errors.push('Yesterday field is required');
    }
    
    if (!formData.today.trim()) {
      errors.push('Today field is required');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const standupData = {
      ...formData
    };
    
    if (isEditing) {
      dispatch(updateStandup(date, standupData));
    } else {
      dispatch(createStandup(standupData));
    }
  };
  
  return (
    <FormContainer>
      <PageHeader>
        <Title>{isEditing ? 'Edit Standup' : 'New Standup'}</Title>
        <Subtitle>{isEditing ? `Editing entry for ${date}` : 'Create a new standup entry'}</Subtitle>
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
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="yesterday">What did you do yesterday?</Label>
          <Textarea
            id="yesterday"
            name="yesterday"
            value={formData.yesterday}
            onChange={handleChange}
            placeholder="I worked on..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="today">What will you do today?</Label>
          <Textarea
            id="today"
            name="today"
            value={formData.today}
            onChange={handleChange}
            placeholder="Today I will..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="blockers">Any blockers?</Label>
          <Textarea
            id="blockers"
            name="blockers"
            value={formData.blockers}
            onChange={handleChange}
            placeholder="I'm blocked by..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <TagInput
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tag and press Enter"
          />
          <TagsContainer>
            {formData.tags.map((tag, index) => (
              <Tag key={index}>
                #{tag}
                <TagDeleteButton onClick={() => handleRemoveTag(tag)} type="button">
                  ×
                </TagDeleteButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>
        
        <RatingContainer>
          <RatingLabel>How was your mood?</RatingLabel>
          <RatingOptions>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingOption
                key={value}
                type="button"
                selected={formData.mood === value}
                onClick={() => handleSetRating('mood', value)}
              >
                {value}
              </RatingOption>
            ))}
          </RatingOptions>
        </RatingContainer>
        
        <RatingContainer>
          <RatingLabel>Rate your productivity</RatingLabel>
          <RatingOptions>
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingOption
                key={value}
                type="button"
                selected={formData.productivity === value}
                onClick={() => handleSetRating('productivity', value)}
              >
                {value}
              </RatingOption>
            ))}
          </RatingOptions>
        </RatingContainer>
        
        <ToggleContainer>
          <ToggleLabel>
            <ToggleSwitch checked={formData.isHighlight} onClick={handleToggleHighlight} />
            Mark as highlight
          </ToggleLabel>
        </ToggleContainer>
        
        {(validationErrors.length > 0 || error) && (
          <ErrorMessage>
            {validationErrors.map((err, index) => (
              <div key={index}>{err}</div>
            ))}
            {error && <div>{error}</div>}
          </ErrorMessage>
        )}
        
        <ButtonContainer>
          <CancelButton type="button" onClick={() => navigate('/standups')}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Standup' : 'Create Standup'}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </FormContainer>
  );
};

export default StandupForm; 