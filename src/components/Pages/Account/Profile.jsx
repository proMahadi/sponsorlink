import React, { useState, useEffect } from "react";
import { Divider, Input, Select, Toggle, Textarea } from "@geist-ui/core";
import { Mail, Phone, ExternalLink, Twitter, Github, Linkedin, Edit } from "@geist-ui/icons";
import { industryChoices, countryChoices, tagChoices } from '@/utils/constants';


const INITIAL_DATA = {
  name: '',
  first_name: '',
  surname: '',
  email: '',
  phone: "",
  profile_image: "",
  country: "",
  address: "",
  postcode: "",
  city: "",
  available: null,
  username: "",
  bio: "",
  user_type: '',
  industry: '',
  linkedin: "",
  github: "",
  twitter: "",
  instagram: "",
  youtube: "",
  tiktok: "",
  tags: [],
  specialized_tags: []
};

const ProfileSection = ({ 
    title, 
    subtitle, 
    children
  }) => {
    return (
      <div className="profile-section">
        <div className="profile-section-title">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="profile-section-card">
          <div className="card-content">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const PersonalInfoForm = ({ formData, editMode, onInputChange, onSelectChange }) => {
    return (
      <>
        <div className="card-row">
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={onInputChange}
            placeholder="First name"
            width="100%"
            readOnly={!editMode}
          >
            First name
          </Input>
          <Input
            name="surname"
            value={formData.surname}
            onChange={onInputChange}
            placeholder="Surname"
            width="100%"
            readOnly={!editMode}
          >
            Surname
          </Input>
        </div>
  
        <div className="card-row">
          <Input
            icon={<Mail />}
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Email"
            width="100%"
            readOnly={!editMode}
          >
            Email
          </Input>
          <Input
            icon={<Phone />}
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="Phone number"
            width="100%"
            readOnly={!editMode}
          >
            Phone number
          </Input>
        </div>
  
        <div className="card-row">
          <Input
            name="address"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Address"
            width="100%"
            readOnly={!editMode}
          >
            Address
          </Input>
        </div>
  
        <div className="card-row">
          <Input
            name="postcode"
            value={formData.postcode}
            onChange={onInputChange}
            placeholder="Postcode/ZIP"
            width="100%"
            readOnly={!editMode}
          >
            Postcode/ZIP
          </Input>
          <Input
            name="city"
            value={formData.city}
            onChange={onInputChange}
            placeholder="City"
            width="100%"
            readOnly={!editMode}
          >
            City
          </Input>
          <div className="card-select">
            <div className="select-label">Country</div>
            <Select
              value={formData.country}
              onChange={(val) => onSelectChange(val, 'country')}
              placeholder="Country"
              width="100%"
              disabled={!editMode}
            >

              {countryChoices.map((choice) => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </>
    );
  };

  const ProfileInfoForm = ({ formData, editMode, onInputChange, onSelectChange }) => {
    const bioCharCount = 300 - (formData.bio?.length || 0);
  
    return (
      <>
        <div className="card-row">
          <div className="toggle-row">
            <Toggle
              checked={formData.available}
              onChange={(e) => onSelectChange(e.target.checked, 'available')}
              disabled={!editMode}
              color="green"
            />
            <div className="toggle-text">
              <span>Available for projects</span>
              <span>I'm open and available for freelance work.</span>
            </div>
          </div>
        </div>
  
        <div className="card-row">
          <Input
            name="username"
            value={formData.username}
            onChange={onInputChange}
            placeholder="Username"
            width="100%"
            readOnly={!editMode}
          >
            Username
          </Input>
        </div>
  
        <div className="card-row">
          <div style={{ width: '100%' }}>
            <div className="select-label">Bio</div>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => onSelectChange(e.target.value, 'bio')}
              placeholder="Bio"
              width="100%"
              readOnly={!editMode}
              maxLength={300}
              style={{ minHeight: '125px' }}
            />
            <div className="bio-char-counter">
              {bioCharCount} characters left
            </div>
          </div>
        </div>

        <div className="card-row">
          <div className="card-select" style={{width: '50%'}}>
            <div className="select-label">User Type</div>
            <Select
              value={formData.user_type}
              onChange={(val) => onSelectChange(val, 'user_type')}
              placeholder="Select user type"
              width="100%"
              disabled={!editMode}
            >
              <Select.Option value="individual">Individual</Select.Option>
              <Select.Option value="business">Business</Select.Option>
              <Select.Option value="influencer">Influencer</Select.Option>
            </Select>
          </div>
          
          <div className="card-select" style={{width: '50%'}}>
            <div className="select-label">Industry</div>
            <Select
              value={formData.industry}
              onChange={(val) => onSelectChange(val, 'industry')}
              placeholder="Select industry"
              width="100%"
              disabled={!editMode}
            >
              {industryChoices.map(choice => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
  
        <div className="card-row">
          <Input
            name="twitter"
            icon={<Twitter />}
            value={formData.twitter}
            onChange={onInputChange}
            placeholder="Twitter"
            width="100%"
            readOnly={!editMode}
          >
            Twitter
          </Input>
          <Input
            name="linkedin"
            icon={<Linkedin />}
            value={formData.linkedin}
            onChange={onInputChange}
            placeholder="LinkedIn"
            width="100%"
            readOnly={!editMode}
          >
            LinkedIn
          </Input>
          <Input
            name="github"
            icon={<Github />}
            value={formData.github}
            onChange={onInputChange}
            placeholder="GitHub"
            width="100%"
            readOnly={!editMode}
          >
            GitHub
          </Input>
        </div>

        <div className="card-row">
          <Input
            name="instagram"
            icon={<ExternalLink />}
            value={formData.instagram}
            onChange={onInputChange}
            placeholder="Instagram"
            width="100%"
            readOnly={!editMode}
          >
            Instagram
          </Input>
          <Input
            name="youtube"
            icon={<ExternalLink />}
            value={formData.youtube}
            onChange={onInputChange}
            placeholder="YouTube"
            width="100%"
            readOnly={!editMode}
          >
            YouTube
          </Input>
          <Input
            name="tiktok"
            icon={<ExternalLink />}
            value={formData.tiktok}
            onChange={onInputChange}
            placeholder="TikTok"
            width="100%"
            readOnly={!editMode}
          >
            TikTok
          </Input>
        </div>
  
        <div className="card-row">
          <div style={{ width: '100%' }}>
            <div className="select-label">Tags</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Select
                multiple
                value={formData.tags}
                onChange={(val) => onSelectChange(val, 'tags')}
                placeholder="General tags"
                width="50%"
                disabled={!editMode}
              >
              {tagChoices.map(choice => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
              </Select>
              <Select
                multiple
                value={formData.specialized_tags}
                onChange={(val) => onSelectChange(val, 'specialized_tags')}
                placeholder="Specialised tags"
                width="50%"
                disabled={!editMode}
              >
              {tagChoices.map(choice => (
                  <Select.Option key={choice.value} value={choice.value}>
                    {choice.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </>
    );
  };

function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  useEffect(() => {
    const cachedData = sessionStorage.getItem("user");
    const initialData = cachedData ? JSON.parse(cachedData) : INITIAL_DATA;
    
    initialData.name = `${initialData.first_name}${initialData.surname ? ' ' + initialData.surname : ''}`;
    
    setUserData(initialData);
    setFormData(initialData);
  }, []);

  const handleImageClick = () => {
    setEditMode(true);
    setTempImageUrl(formData.profile_image);
    setImageModalVisible(true);
  };

  const handleImageSubmit = () => {
    setFormData(prev => ({
      ...prev,
      profile_image: tempImageUrl
    }));
    setUserData(prev => ({
      ...prev,
      profile_image: tempImageUrl
    }));
    
    const currentData = JSON.parse(sessionStorage.getItem("user"));
    sessionStorage.setItem("user", JSON.stringify({
      ...currentData,
      profile_image: tempImageUrl
    }));
    
    setImageModalVisible(false);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Update the full name when first_name or surname changes
      if (name === 'first_name' || name === 'surname') {
        newData.name = `${newData.first_name}${newData.surname ? ' ' + newData.surname : ''}`;
      }
      
      return newData;
    });
  };

  const handleSelectChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setUserData(formData);
    sessionStorage.setItem("user", JSON.stringify(formData));
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (editMode && e.key === 'Enter') {
        const activeElement = document.activeElement;
        const isInputActive = activeElement.tagName === 'INPUT' || 
                            activeElement.tagName === 'TEXTAREA' ||
                            activeElement.tagName === 'SELECT';
        
        if (!isInputActive) {
          handleSave();
        }
      }
    };

    if (editMode) {
      document.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [editMode]);

  if (!userData || !formData) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-left">
          <img 
            width="150px" 
            height="150px" 
            src={userData.profile_image} 
            alt="No Image" 
            className={`profile-image ${editMode ? 'profile-image-editable' : ''}`}
            onClick={handleImageClick}
          />
          <div className="profile-info">
            <h2 className="profile-name">{userData.name}</h2>
            <div className="profile-email">{userData.email}</div>
          </div>
        </div>
              <div className="profile-header-right">
                {editMode ? (
                  <>
                    <button className="button btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                    <button className="button btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button className="button btn-secondary" onClick={() => setEditMode(true)}>
                    <span>Edit</span>
                    <Edit size={16} />
                  </button>
                )}
              </div>
            </div>

      <Divider />

      {/* Form Sections */}
      <div className="profile-content">
        <ProfileSection
          title="Personal Info"
          subtitle="Update your photo and personal details"
        >
          <PersonalInfoForm
            formData={formData}
            editMode={editMode}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        </ProfileSection>

        <Divider />

        <ProfileSection
          title="Profile"
          subtitle="Update your portfolio and bio"
        >
          <ProfileInfoForm
            formData={formData}
            editMode={editMode}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        </ProfileSection>
      </div>
    

      {imageModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Profile Image</h3>
            <Input
              placeholder="Enter image URL"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
              width="100%"
            />
            <div className="modal-buttons">
              <button 
                className="button btn-secondary" 
                onClick={() => setImageModalVisible(false)}
              >
                Cancel
              </button>
              <button 
                className="button btn-primary" 
                onClick={handleImageSubmit}
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;