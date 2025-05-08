import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: var(--card-background);
  padding: 2rem 0;
  border-right: 1px solid var(--border-color);
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

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/">
            <NavIcon>📊</NavIcon>
            Dashboard
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/standups">
            <NavIcon>📝</NavIcon>
            All Standups
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/standups/new">
            <NavIcon>➕</NavIcon>
            New Standup
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/weekly-summary">
            <NavIcon>📅</NavIcon>
            Weekly Summary
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/blocker-analysis">
            <NavIcon>🚫</NavIcon>
            Blocker Analysis
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/tags">
            <NavIcon>🏷️</NavIcon>
            Tags
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/search">
            <NavIcon>🔍</NavIcon>
            Search
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/query">
            <NavIcon>💬</NavIcon>
            Natural Language Query
          </StyledNavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar; 