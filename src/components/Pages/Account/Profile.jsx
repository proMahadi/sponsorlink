import React, { useState, useEffect } from "react";
import { Divider, Input, Select, Toggle, Textarea } from "@geist-ui/core";
import {
  Mail,
  Phone,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  Edit,
} from "@geist-ui/icons";
import { industryChoices, countryChoices, tagChoices } from "@/utils/constants";
import { getCurrentUser, updateProfile, updateProfileImage } from "@/api/user";
import { getIndustry } from "@/api/industry.js";
import { getTags } from "@/api/tags.js";
import clientAxios from "@/api/axios";
import { useAuthContext } from "@/context/AuthContext";

const INITIAL_DATA = {
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  industries: [],
  username: "",
  profile: {
    phone: "",
    profile_image: "",
    country: "",
    address: "",
    postcode: "",
    city: "",
    opportunities: false,
    bio: "",
    user_type: "",
    social_links: {
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
  },
  tags: [],
};

const ProfileSection = ({ title, subtitle, children }) => {
  return (
    <div className="profile-section">
      <div className="profile-section-title">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="profile-section-card">
        <div className="card-content">{children}</div>
      </div>
    </div>
  );
};

const PersonalInfoForm = ({
  formData,
  editMode,
  onInputChange,
  onSelectChange,
}) => {
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
          name="last_name"
          value={formData.last_name}
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
          disabled
        >
          Email
        </Input>
        <Input
          icon={<Phone />}
          name="profile.phone"
          value={formData.profile.phone}
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
          name="profile.address"
          value={formData.profile.address}
          onChange={onInputChange}
          placeholder="Address"
          width="100%"
          readOnly={!editMode}
        >
          Address
        </Input>
      </div>

      {/*<div className="card-row">*/}
      {/*  <Input*/}
      {/*    name="postcode"*/}
      {/*    value={formData.postcode}*/}
      {/*    onChange={onInputChange}*/}
      {/*    placeholder="Postcode/ZIP"*/}
      {/*    width="100%"*/}
      {/*    readOnly={!editMode}*/}
      {/*  >*/}
      {/*    Postcode/ZIP*/}
      {/*  </Input>*/}
      {/*  <Input*/}
      {/*    name="city"*/}
      {/*    value={formData.profile.city}*/}
      {/*    onChange={onInputChange}*/}
      {/*    placeholder="City"*/}
      {/*    width="100%"*/}
      {/*    readOnly={!editMode}*/}
      {/*  >*/}
      {/*    City*/}
      {/*  </Input>*/}
      {/*  <div className="card-select">*/}
      {/*    <div className="select-label">Country</div>*/}
      {/*    <Select*/}
      {/*      initialValue={formData.profile.country}*/}
      {/*      onChange={(val) => onSelectChange(val, "country")}*/}
      {/*      placeholder="Country"*/}
      {/*      width="100%"*/}
      {/*      disabled={!editMode}*/}
      {/*    >*/}
      {/*      {countryChoices.map((choice) => (*/}
      {/*        <Select.Option key={choice.value} value={choice.value}>*/}
      {/*          {choice.label}*/}
      {/*        </Select.Option>*/}
      {/*      ))}*/}
      {/*    </Select>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};

const ProfileInfoForm = ({
  formData,
  editMode,
  tags,
  industries,
  onInputChange,
  onSelectChange,
}) => {
  const bioCharCount = 300 - (formData.profile.bio?.length || 0);

  return (
    <>
      <div className="card-row">
        <div className="toggle-row">
          <Toggle
            checked={formData.profile.opportunities}
            onChange={(e) =>
              onSelectChange(e.target.checked, "profile.opportunities")
            }
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
        <div style={{ width: "100%" }}>
          <div className="select-label">Bio</div>
          <Textarea
            name="profile.bio"
            value={formData.profile.bio}
            onChange={(e) => onSelectChange(e.target.value, "profile.bio")}
            placeholder="Bio"
            width="100%"
            readOnly={!editMode}
            maxLength={300}
            style={{ minHeight: "125px" }}
          />
          <div className="bio-char-counter">{bioCharCount} characters left</div>
        </div>
      </div>

      <div className="card-row">
        <div className="card-select" style={{ width: "50%" }}>
          <div className="select-label">User Type</div>
          <Select
            value={formData.profile.user_type}
            onChange={(val) => onSelectChange(val, "profile.user_type")}
            placeholder="Select user type"
            width="100%"
            disabled={!editMode}
          >
            <Select.Option value="individual">Individual</Select.Option>
            <Select.Option value="business">Business</Select.Option>
            <Select.Option value="influencer">Influencer</Select.Option>
          </Select>
        </div>

        <div className="card-select" style={{ width: "50%" }}>
          <div className="select-label">Industry</div>
          <Select
            value={formData.industries[0]?.id ? String(formData.industries[0]?.id) : ""}
            onChange={(val) => onSelectChange(val, "industries")}
            placeholder="Select industry"
            width="100%"
            disabled={!editMode}
          >
            {industries.map((choice) => (
              <Select.Option key={String(choice.id)} value={String(choice.id)}>
                {choice.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="card-row">
        <Input
          icon={<Twitter />}
          name="profile.social_links.twitter"
          value={formData.profile.social_links.twitter}
          onChange={onInputChange}
          placeholder="Twitter"
          width="100%"
          readOnly={!editMode}
        >
          Twitter
        </Input>
        <Input
          icon={<Linkedin />}
          name="profile.social_links.linkedin"
          value={formData.profile.social_links.linkedin}
          onChange={onInputChange}
          placeholder="LinkedIn"
          width="100%"
          readOnly={!editMode}
        >
          LinkedIn
        </Input>
        <Input
          icon={<Github />}
          name="profile.social_links.github"
          value={formData.profile.social_links.github}
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
          icon={<ExternalLink />}
          name="profile.social_links.instagram"
          value={formData.profile.social_links.instagram}
          onChange={onInputChange}
          placeholder="Instagram"
          width="100%"
          readOnly={!editMode}
        >
          Instagram
        </Input>
        <Input
          icon={<ExternalLink />}
          name="profile.social_links.youtube"
          value={formData.profile.social_links.youtube}
          onChange={onInputChange}
          placeholder="YouTube"
          width="100%"
          readOnly={!editMode}
        >
          YouTube
        </Input>
        <Input
          icon={<ExternalLink />}
          name="profile.social_links.tiktok"
          value={formData.profile.social_links.tiktok}
          onChange={onInputChange}
          placeholder="TikTok"
          width="100%"
          readOnly={!editMode}
        >
          TikTok
        </Input>
      </div>

      <div className="card-row">
        <div style={{ width: "100%" }}>
          <div className="select-label">Tags</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Select
              multiple
              value={formData.tags.map((tag) => String(tag?.id))}
              onChange={(val) => onSelectChange(val, "tags")}
              placeholder="Select tags"
              width="100%"
              disabled={!editMode}
            >
              {tags.map((choice) => (
                <Select.Option
                  key={String(choice.id)}
                  value={String(choice.id)}
                >
                  {choice.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [tempImageFile, setTempImageFile] = useState();
  const [industries, setIndustries] = useState([]);
  const [tags, setTags] = useState([]);

  const { refresh } = useAuthContext();

  useEffect(() => {
    getIndustry().then((data) => {
      setIndustries(data);
    });

    getTags().then((data) => {
      setTags(data);
    });
  }, []);

  useEffect(() => {
    const cachedData = sessionStorage.getItem("user");
    const initialData = cachedData ? JSON.parse(cachedData) : INITIAL_DATA;

    initialData.name = `${initialData.first_name}${
      initialData.surname ? " " + initialData.surname : ""
    }`;
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      try {
        setUserData(currentUser);
        setFormData(currentUser);
        console.log(formData, 'from the profile view')
      } catch (error) {}
    };
    fetchCurrentUser();
    console.log(userData, "userData");
  }, []);

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setEditMode(true);
        setTempImageFile(file);
      }
    };

    input.click();
  };

  /*   const handleImageSubmit = () => {
    setFormData((prev) => ({
      ...prev,
      profile_image: tempImageFile,
    }))
    setUserData((prev) => ({
      ...prev,
      profile_image: tempImageFile,
    }))

    const currentData = JSON.parse(sessionStorage.getItem('user'))
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        ...currentData,
        profile_image: tempImageFile,
      })
    )

    setImageModalVisible(false)
    setEditMode(false)
  } */

  const handleInputChange = (e) => {
    const { name, value } = e.target; // Here the name can be like "profile.phone..." or "first_name"
    const keys = name.split(".");

    setFormData((prev) => {
      const clonedData = structuredClone(prev);

      if (name === "first_name" || name === "last_name") {
        clonedData.name = [clonedData.first_name, clonedData.last_name]
          .filter(Boolean)
          .join(" ");
      }

      let current = clonedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return clonedData;
    });
  };

  const handleSelectChange = (value, field) => {
    setFormData((prev) => {
      const clonedData = structuredClone(prev);
      const keys = field.split(".");

      if (field === "industries") {
        clonedData.industries = value ? [{ id: Number(value) }] : [];
        return clonedData;
      }

      if (field === "tags") {
        clonedData.tags = Array.isArray(value)
            ? value.map(tagId => ({ id: Number(tagId) }))
            : [];
        return clonedData;
      }

      // Handle other fields as before
      let current = clonedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return clonedData;
    });
  };

  const handleSave = async () => {
    console.log(formData, "ultimate form data");
    await updateProfile(
      {
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
      },
      {
        bio: formData.profile.bio || undefined,
        age: formData.profile.age || undefined,
        phone: formData.profile.phone || undefined,
        location: formData.profile.location || undefined,
        birth_date: formData.profile.birth_date || undefined,
        gender: formData.profile.gender || undefined,
        opportunities: formData.profile.opportunities || undefined,
        latitude: formData.profile.latitude || undefined,
        longitude: formData.profile.longitude || undefined,
        country: formData.profile.country || undefined,
        city: formData.profile.city || undefined,
        address: formData.profile.address || undefined,
        user_type: formData.profile.user_type || undefined,

        facebook: formData.profile.social_links.facebook || undefined,
        instagram: formData.profile.social_links.instagram || undefined,
        twitter: formData.profile.social_links.twitter || undefined,
        snapchat: formData.profile.social_links.snapchat || undefined,
        youtube: formData.profile.social_links.youtube || undefined,
        tiktok: formData.profile.social_links.tiktok || undefined,
        linkedin: formData.profile.social_links.linkedin || undefined,
        github: formData.profile.social_links.github || undefined,
        reddit: formData.profile.social_links.reddit || undefined,
        pinterest: formData.profile.social_links.pinterest || undefined,
        discord: formData.profile.social_links.discord || undefined,
        telegram: formData.profile.social_links.telegram || undefined,
        mastodon: formData.profile.social_links.mastodon || undefined,
        whatsapp: formData.profile.social_links.whatsapp || undefined,
      },
      formData.industries
        ? Number(formData.industries[0]?.id)
        : undefined,
      formData.tags.map(tag => Number(tag?.id))
    );

    if (tempImageFile instanceof File) {
      await updateProfileImage(tempImageFile);
    }

    await refresh();
    setUserData(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (editMode && e.key === "Enter") {
        const activeElement = document.activeElement;
        const isInputActive =
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT";

        if (!isInputActive) {
          handleSave();
        }
      }
    };

    if (editMode) {
      document.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
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
            src={
              (tempImageFile
                ? URL.createObjectURL(tempImageFile)
                : undefined) ??
              (userData.profile?.profile_image &&
                (userData.profile?.profile_image?.startsWith?.("http")
                  ? userData.profile.profile_image
                  : `https://api.trupersona.mohuls.com${userData.profile.profile_image}`)) ??
              "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1339.jpg"
            }
            alt="profile image"
            className={`profile-image ${
              editMode ? "profile-image-editable" : ""
            }`}
            onClick={handleImageClick}
          />
          <div className="profile-info">
            <h2 className="profile-name">
              {userData.first_name} {userData.last_name}
            </h2>
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
            <button
              className="button btn-secondary"
              onClick={() => setEditMode(true)}
            >
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
            tags={tags}
            industries={industries}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        </ProfileSection>
      </div>

      {/* {imageModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Profile Image</h3>
            <Input
              placeholder="Enter image URL"
              value={tempImageFile}
              onChange={(e) => setTempImageFile(e.target.value)}
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
      )} */}
    </div>
  );
}
