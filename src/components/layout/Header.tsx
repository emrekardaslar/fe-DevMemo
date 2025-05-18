import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logoutUser } from '../../redux/auth/actions';

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

const UserMenuContainer = styled.div`
  position: relative;
  margin-left: 1.5rem;
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #ffffff40;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ffffff50;
  }
`;

const UserMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  margin-top: 0.5rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 100;
`;

const UserMenuHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f1f1f1;
`;

const UserName = styled.p`
  margin: 0;
  font-weight: bold;
  color: #333;
`;

const UserEmail = styled.p`
  margin: 0.3rem 0 0 0;
  font-size: 0.8rem;
  color: #666;
`;

const UserMenuItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserMenuItem = styled.li`
  padding: 0;
`;

const UserMenuLink = styled(Link)`
  padding: 0.8rem 1rem;
  display: block;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
    text-decoration: none;
  }
`;

const UserMenuButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.8rem 1rem;
  display: block;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-left: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    text-decoration: none;
  }
`;

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userAvatarRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    navigate('/login');
  };
  
  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Main menu close logic
      if (
        menuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
      
      // User menu close logic
      if (
        userMenuOpen && 
        userMenuRef.current && 
        userAvatarRef.current && 
        !userMenuRef.current.contains(event.target as Node) && 
        !userAvatarRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, userMenuOpen]);

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
        
        {isAuthenticated && user ? (
          <UserMenuContainer>
            <UserAvatar 
              ref={userAvatarRef} 
              onClick={toggleUserMenu}
              aria-expanded={userMenuOpen}
            >
              {getInitials()}
            </UserAvatar>
            <UserMenu $isOpen={userMenuOpen} ref={userMenuRef}>
              <UserMenuHeader>
                <UserName>{`${user.firstName} ${user.lastName}`}</UserName>
                <UserEmail>{user.email}</UserEmail>
              </UserMenuHeader>
              <UserMenuItems>
                <UserMenuItem>
                  <UserMenuLink to="/profile" onClick={() => setUserMenuOpen(false)}>
                    Profile
                  </UserMenuLink>
                </UserMenuItem>
                <UserMenuItem>
                  <UserMenuButton onClick={handleLogout}>
                    Logout
                  </UserMenuButton>
                </UserMenuItem>
              </UserMenuItems>
            </UserMenu>
          </UserMenuContainer>
        ) : (
          <LoginButton to="/login">Login</LoginButton>
        )}
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 