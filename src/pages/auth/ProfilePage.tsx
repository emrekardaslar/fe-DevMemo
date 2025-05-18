import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getProfile, logoutUser } from '../../redux/auth/actions';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  background-color: #6c5ce7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 1.5rem;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
`;

const ProfileEmail = styled.p`
  margin: 0;
  color: #666;
  font-size: 1rem;
`;

const ProfileRole = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background-color: #6c5ce7;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ProfileDetail = styled.div`
  margin-bottom: 1rem;
`;

const DetailLabel = styled.p`
  font-weight: bold;
  margin: 0 0 0.3rem 0;
  color: #555;
  font-size: 0.9rem;
`;

const DetailValue = styled.p`
  margin: 0;
  color: #333;
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:focus {
    outline: none;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #6c5ce7;
  color: white;

  &:hover {
    background-color: #5649c8;
  }
`;

const DangerButton = styled(Button)`
  background-color: #ff6b6b;
  color: white;

  &:hover {
    background-color: #ee5253;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #e9ecef;
  color: #495057;

  &:hover {
    background-color: #dee2e6;
  }
`;

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [accountCreationDate, setAccountCreationDate] = useState<string>('');
  
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  
  useEffect(() => {
    if (user?.createdAt) {
      const date = new Date(user.createdAt);
      setAccountCreationDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [user]);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  
  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  if (loading) {
    return <div>Loading profile...</div>;
  }
  
  if (!user) {
    return (
      <div>
        <p>Unable to load profile. Please try again later.</p>
        <button onClick={() => dispatch(getProfile())}>Retry</button>
      </div>
    );
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>{getInitials()}</ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{`${user.firstName} ${user.lastName}`}</ProfileName>
          <ProfileEmail>{user.email}</ProfileEmail>
          {user.roles && user.roles.map((role, index) => (
            <ProfileRole key={index}>{role}</ProfileRole>
          ))}
        </ProfileInfo>
      </ProfileHeader>
      
      <ProfileSection>
        <SectionTitle>Account Information</SectionTitle>
        <ProfileDetail>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>{user.email}</DetailValue>
        </ProfileDetail>
        <ProfileDetail>
          <DetailLabel>Account Created</DetailLabel>
          <DetailValue>{accountCreationDate}</DetailValue>
        </ProfileDetail>
        <ProfileDetail>
          <DetailLabel>Email Verification</DetailLabel>
          <DetailValue>
            {user.isVerified ? 'Verified' : 'Not Verified'}
            {!user.isVerified && (
              <button className="btn btn-link p-0 ml-2">Resend Verification Email</button>
            )}
          </DetailValue>
        </ProfileDetail>
      </ProfileSection>
      
      <ButtonContainer>
        <PrimaryButton onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate('/profile/change-password')}>
          Change Password
        </SecondaryButton>
        <DangerButton onClick={handleLogout}>
          Logout
        </DangerButton>
      </ButtonContainer>
    </ProfileContainer>
  );
};

export default ProfilePage; 