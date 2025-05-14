import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface SidebarProps {
  $isVisible: boolean;
}

const SidebarContainer = styled.aside<SidebarProps>`
  width: 240px;
  background-color: var(--card-background);
  padding: 2rem 0;
  border-right: 1px solid var(--border-color);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: ${({ $isVisible }) => $isVisible ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${({ $isVisible }) => $isVisible ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'};
    padding-top: 4rem;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 2rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    color: var(--primary-color);
    font-weight: 600;
    border-right: 3px solid var(--primary-color);
    background-color: rgba(52, 152, 219, 0.05);
  }
`;

const NavIcon = styled.span`
  margin-right: 0.75rem;
`;

const ToggleButton = styled.button`
  display: none;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1001;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div<SidebarProps>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $isVisible }) => $isVisible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const Sidebar: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeSidebar = () => {
    if (windowWidth <= 768) {
      setSidebarVisible(false);
    }
  };

  return (
    <>
      <Overlay $isVisible={sidebarVisible} onClick={closeSidebar} />
      <SidebarContainer $isVisible={sidebarVisible}>
        <NavList>
          <NavItem>
            <StyledNavLink to="/" onClick={closeSidebar}>
              <NavIcon>📊</NavIcon>
              Dashboard
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/standups" onClick={closeSidebar}>
              <NavIcon>📝</NavIcon>
              All Standups
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/standups/new" onClick={closeSidebar}>
              <NavIcon>➕</NavIcon>
              New Standup
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/weekly-summary" onClick={closeSidebar}>
              <NavIcon>📅</NavIcon>
              Weekly Summary
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/monthly-focus" onClick={closeSidebar}>
              <NavIcon>📆</NavIcon>
              Monthly Focus
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/blocker-analysis" onClick={closeSidebar}>
              <NavIcon>🚫</NavIcon>
              Blocker Analysis
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/tags" onClick={closeSidebar}>
              <NavIcon>🏷️</NavIcon>
              Tags
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/search" onClick={closeSidebar}>
              <NavIcon>🔍</NavIcon>
              Search
            </StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/query" onClick={closeSidebar}>
              <NavIcon>💬</NavIcon>
              Natural Language Query
            </StyledNavLink>
          </NavItem>
        </NavList>
      </SidebarContainer>
      <ToggleButton onClick={toggleSidebar}>
        {sidebarVisible ? '✕' : '☰'}
      </ToggleButton>
    </>
  );
};

export default Sidebar; 