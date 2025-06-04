import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileView.css';

function ProfileView() {
  const [user, setUser] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      setStatus('Error signing out.');
      console.error(error);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) return;
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setStatus('Display name updated.');
      setUser({ ...auth.currentUser });
      setNewDisplayName('');
    } catch (error) {
      setStatus('Failed to update name.');
      console.error(error);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return;
    try {
      await updatePassword(auth.currentUser, newPassword);
      setStatus('Password updated.');
      setNewPassword('');
    } catch (error) {
      setStatus('Failed to update password.');
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(auth.currentUser);
      navigate('/');
    } catch (error) {
      setStatus('Failed to delete account. Re-auth may be required.');
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {user && (
          <>
            <h1>Settings</h1>
            <p><strong>Display Name:</strong> {user.displayName || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Link to="/subscriptions" className="profile-link">
              <p>Manage your subscriptions</p>
            </Link>

            <div className="profile-section">
              <h3>Update Display Name</h3>
              <input
                type="text"
                placeholder="New display name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
              <button onClick={handleUpdateDisplayName}>Update Name</button>
            </div>

            <div className="profile-section">
              <h3>Change Password</h3>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleUpdatePassword}>Update Password</button>
            </div>

            <div className="profile-section danger">
              <h3>Danger Zone</h3>
              <button onClick={handleDeleteAccount} className="delete-btn">Delete Account</button>
            </div>

            <div className="profile-button-group">
              <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
            </div>

            {status && <p className="profile-status">{status}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
