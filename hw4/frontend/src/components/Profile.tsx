import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import type { UserProfile } from '../mocks/mockApi';
import '../styles/Profile.css';

const Profile = () => {
  const { refreshAuth } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const loadProfile = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load profile');
        return;
      }

      const data = (await response.json()) as UserProfile;
      setProfile(data);
    } catch (loadError) {
      if (loadError instanceof Error) {
        setError(loadError.message);
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploadMessage('');

    if (!selectedFile) {
      setUploadMessage('Please choose an image first.');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setUploadMessage('Only image files are allowed.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await fetch(`${API_BASE_URL}/users/upload-profile-picture`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadMessage(errorData.error || 'Upload failed');
        return;
      }

      const data = (await response.json()) as { imageUrl: string };
      
      // Fetch the updated profile picture from dedicated endpoint
      const picResponse = await fetch(`${API_BASE_URL}/users/profile-picture`, {
        credentials: 'include',
      });

      let pictureUrl = data.imageUrl;
      if (picResponse.ok) {
        const picData = await picResponse.blob();
        pictureUrl = URL.createObjectURL(picData);
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profile_picture_url: pictureUrl,
              updated_at: new Date().toISOString(),
            }
          : null
      );
      await refreshAuth();
      setSelectedFile(null);
      setUploadMessage('Profile picture updated successfully.');
    } catch {
      setUploadMessage('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="welcome-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="welcome-container">{error}</div>;
  }

  if (!profile) {
    return <div className="welcome-container">No profile data found.</div>;
  }

  return (
    <div className="profile-page">
      <h1 className="welcome-title">Profile</h1>

      <div className="profile-card profile-header">
        <img
          src={profile.profile_picture_url || 'https://placehold.co/120x120?text=Avatar'}
          alt="Profile"
          className="profile-avatar"
        />
        <div>
          <h2>{profile.full_name}</h2>
          <p className="welcome-text">@{profile.username}</p>
          <p className="welcome-text">{profile.email}</p>
        </div>
      </div>

      <div className="profile-card profile-details-grid">
        <div>
          <h3>Phone</h3>
          <p>{profile.phone_number || 'N/A'}</p>
        </div>
        <div>
          <h3>Birth Date</h3>
          <p>{profile.birth_date || 'N/A'}</p>
        </div>
        <div>
          <h3>Created At</h3>
          <p>{new Date(profile.created_at).toLocaleString()}</p>
        </div>
        <div>
          <h3>Last Updated</h3>
          <p>{new Date(profile.updated_at).toLocaleString()}</p>
        </div>
      </div>

      <form className="profile-card profile-upload" onSubmit={handleUpload}>
        <h3>Update Profile Picture</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Picture'}
        </button>
        {uploadMessage ? <p className="upload-message">{uploadMessage}</p> : null}
      </form>
    </div>
  );
};

export default Profile;