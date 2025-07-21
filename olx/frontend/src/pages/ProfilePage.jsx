import React, { useState, useEffect, useRef } from 'react';
import API from '../api';
import '../App.css';

const StarRating = ({ rating }) => {
  if (typeof rating !== 'number') return null;
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? 'gold' : 'lightgray' }}>★</span>
  ));
  return <div>{stars} ({rating.toFixed(1)})</div>;
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phoneNo: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get('/users/me');
        setProfile(response.data);
        setFormData({ name: response.data.name, phoneNo: response.data.phoneNo || '' });
      } catch (err) {
        setError('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put('/users/me', formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('avatar', file);
    try {
      const response = await API.put('/users/me/avatar', uploadData);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to update profile picture.');
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profile) return <p>Could not load profile.</p>;

  return (
    <div className="profile-page-container">
      <div className="profile-card-large">
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} accept="image/*" />
        <img
          src={profile.profilePic}
          alt="Profile"
          className="profile-image"
          onClick={() => fileInputRef.current.click()}
          title="Click to change profile picture"
        />
        
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="profile-edit-form">
            <h3>Edit Details</h3>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" />
            <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleInputChange} placeholder="Phone Number" />
            <div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{marginLeft: '10px'}}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <h2>{profile.name}</h2>
            <StarRating rating={profile.averageRating} />
            <p style={{ marginTop: '20px' }}><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phoneNo || 'Not provided'}</p>
            <button onClick={() => setIsEditing(true)} style={{ marginTop: '20px' }}>Edit Profile</button>
          </div>
        )}
      </div>
      {/* You can add the reviews section here later if you wish */}
    </div>
  );
}

export default ProfilePage;