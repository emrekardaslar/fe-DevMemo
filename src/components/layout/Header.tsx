import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* Ensure children can be positioned relative to this */
  z-index: 110; /* Ensure header is above other elements */

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const LogoIcon = styled.span`
  margin-right: 0.5rem;
`;

// Using a div instead of nav to avoid isOpen prop warning
const StyledNav = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    right: 0;
    flex-direction: column;
    background-color: var(--primary-color);
    width: 200px;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <HeaderContainer>
      <Logo to="/">
        <LogoIcon>📝</LogoIcon>
        StandupSync
      </Logo>
      <NavContainer>
        <MenuButton ref={buttonRef} onClick={toggleMenu} aria-expanded={menuOpen}>
          {menuOpen ? '✕' : '☰'}
        </MenuButton>
        <div ref={menuRef}>
          <StyledNav $isOpen={menuOpen} role="navigation">
            <NavLink to="/standups/new" onClick={() => setMenuOpen(false)}>New Standup</NavLink>
            <NavLink to="/query" onClick={() => setMenuOpen(false)}>Query</NavLink>
          </StyledNav>
        </div>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 