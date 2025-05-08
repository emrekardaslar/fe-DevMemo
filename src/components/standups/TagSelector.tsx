import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// Types
interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

// Styled components
const TagSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  min-height: 46px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--card-background);
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
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
  border: none;
  font-size: 0.9rem;
  background: transparent;
  
  &:focus {
    outline: none;
  }
`;

const SuggestionsContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  z-index: 10;
  list-style: none;
`;

const SuggestionItem = styled.li<{ isActive: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${props => props.isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
`;

const TagCount = styled.span`
  margin-left: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
`;

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ tag: string, count: number }>>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  
  // Get all standups to extract tags
  const { standups } = useSelector((state: RootState) => state.standups);
  
  // Extract unique tags and their counts from all standups
  const allTags = React.useMemo(() => {
    const tagCount = new Map<string, number>();
    
    standups.forEach(standup => {
      standup.tags.forEach(tag => {
        const count = tagCount.get(tag) || 0;
        tagCount.set(tag, count + 1);
      });
    });
    
    return Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [standups]);
  
  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue.trim()) {
      const filteredSuggestions = allTags
        .filter(({ tag }) => 
          tag.toLowerCase().includes(inputValue.toLowerCase()) && 
          !selectedTags.includes(tag)
        )
        .slice(0, 10); // Limit to 10 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
      setActiveSuggestionIndex(0);
    } else {
      // Show most used tags when input is empty
      const topTags = allTags
        .filter(({ tag }) => !selectedTags.includes(tag))
        .slice(0, 5); // Show top 5 tags
      
      setSuggestions(topTags);
      setShowSuggestions(topTags.length > 0 && document.activeElement === inputRef.current);
    }
  }, [inputValue, allTags, selectedTags]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle key events for keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (showSuggestions && suggestions.length > 0) {
        // Add the selected suggestion
        handleSelectSuggestion(suggestions[activeSuggestionIndex].tag);
      } else if (inputValue.trim()) {
        // Add a new tag if it doesn't exist in selectedTags
        const newTag = inputValue.trim().toLowerCase();
        
        if (!selectedTags.includes(newTag)) {
          onTagsChange([...selectedTags, newTag]);
        }
        
        setInputValue('');
      }
    } else if (e.key === 'ArrowDown') {
      if (showSuggestions) {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        
        // Scroll the active item into view
        if (suggestionsRef.current) {
          const activeItem = suggestionsRef.current.children[activeSuggestionIndex + 1];
          if (activeItem) {
            (activeItem as HTMLElement).scrollIntoView({ block: 'nearest' });
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      if (showSuggestions) {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        
        // Scroll the active item into view
        if (suggestionsRef.current) {
          const activeItem = suggestionsRef.current.children[activeSuggestionIndex - 1];
          if (activeItem) {
            (activeItem as HTMLElement).scrollIntoView({ block: 'nearest' });
          }
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && inputValue === '') {
      // Remove the last tag when pressing backspace with empty input
      if (selectedTags.length > 0) {
        onTagsChange(selectedTags.slice(0, -1));
      }
    }
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle focus and blur events
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleBlur = (e: React.FocusEvent) => {
    // Check if the related target is within our component
    if (
      !e.currentTarget.contains(e.relatedTarget as Node) && 
      !suggestionsRef.current?.contains(e.relatedTarget as Node)
    ) {
      setShowSuggestions(false);
    }
  };
  
  return (
    <TagSelectorContainer onBlur={handleBlur}>
      <TagInputContainer>
        {selectedTags.map(tag => (
          <Tag key={tag}>
            {tag}
            <TagDeleteButton 
              type="button" 
              onClick={() => handleRemoveTag(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </TagDeleteButton>
          </Tag>
        ))}
        <TagInput
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={selectedTags.length === 0 ? "Add tags (press Enter)" : ""}
          autoComplete="off"
        />
      </TagInputContainer>
      
      {showSuggestions && (
        <SuggestionsContainer>
          <SuggestionsList ref={suggestionsRef}>
            {suggestions.map(({ tag, count }, index) => (
              <SuggestionItem
                key={tag}
                isActive={index === activeSuggestionIndex}
                onClick={() => handleSelectSuggestion(tag)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
              >
                {tag}
                <TagCount>({count})</TagCount>
              </SuggestionItem>
            ))}
          </SuggestionsList>
        </SuggestionsContainer>
      )}
    </TagSelectorContainer>
  );
};

export default TagSelector; 