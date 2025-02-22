import React, { useState, useEffect } from "react";
import {
  Divider,
  Input,
  Select,
  Toggle,
  Textarea,
  Modal,
} from "@geist-ui/core";
import {
  Mail,
  Phone,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  Edit,
} from "@geist-ui/icons";
import { industryChoices, tagChoices, countryChoices } from "@/utils/constants";
import "@/styles/Auth.css";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const INITIAL_DATA = {
  id: null,
  email: "",
  password: "",
  hasRegistered: false,
  first_name: "",
  surname: "",
  name: "",
  phone: "",
  profile_image: "",
  country: "",
  address: "",
  postcode: "",
  city: "",
  latitude: null,
  longitude: null,
  available: null,
  username: "",
  bio: "",
  user_type: "",
  industry: "",
  linkedin: "",
  github: "",
  twitter: "",
  instagram: "",
  youtube: "",
  tiktok: "",
  tags: [],
  specialized_tags: [],
};

const CreateProfileSchema = z.object({
  first_name: z.string().min(1, "first name is required"),
  surname: z.string().min(1, "surname is required"),
  username: z.string().min(1, "username is required"),
  phone_number: z.string().min(1, "phone number is required"),
  user_type: z.string().min(1, "user type is required"),
  industryChoices: z.string().min(1, "industry field is required"),
  tagChoices: z.string().min((length = 1), "minimum 1 tag is required"),
  linkedin: z.string().min(1, "linkedin profile is required"),
  github: z.string().min(1, "github profile is required"),
  twitter: z.string().min(1, "twitter profile is required"),
  instagram: z.string().min(1, "instagram profile is required"),
  youtube: z.string().min(1, "youtube profile is required"),
  tiktok: z.string().min(1, "tiktok profile is required"),
});

export default function RegiserForm({ User, setUser }) {
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [currentStep, setCurrentStep] = useState("personal"); // 'personal' or 'profile'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const {
    register,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: "",
      surname: "",
      username: "",
      phone_number: "",
      user_type: "",
      industryChoices: "",
      tags: [],
      linkedin: "",
      github: "",
      twitter: "",
      instagram: "",
      youtube: "",
      tiktok: "",
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "tags",
  });

  useEffect(() => {
    if (User?.id) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((u) => u.id === User.id);
      if (existingUser) {
        setFormData({ ...existingUser });
      } else {
        setFormData({ ...INITIAL_DATA, ...User });
      }
    }
  }, [User]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => {
      const updates = {
        ...prev,
        [name]: value,
      };

      if (name === "first_name" || name === "surname") {
        updates.name = `${updates.first_name} ${updates.surname}`.trim();
      }

      return updates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get location data before saving
    const { address, postcode, city, country } = formData;
    const query = `${address}, ${postcode}, ${city}, ${country}`;
    const apiKey = "1f64891487fe462d8161fc8f19befe87";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&no_annotations=1&language=en`;

    try {
      const response = await axios.get(url);
      const results = response.data;

      let updatedFormData = {
        ...formData,
        hasRegistered: true,
      };

      if (results && results.results.length > 0) {
        updatedFormData = {
          ...updatedFormData,
          latitude: results.results[0].geometry.lat,
          longitude: results.results[0].geometry.lng,
        };
      }

      // Update localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === formData.id);

      if (userIndex >= 0) {
        users[userIndex] = updatedFormData;
      } else {
        users.push(updatedFormData);
      }

      localStorage.setItem("users", JSON.stringify(users));

      // Update sessionStorage
      sessionStorage.setItem("user", JSON.stringify(updatedFormData));

      // Update state
      setUser(updatedFormData);
    } catch (error) {
      console.error("Error fetching location data:", error);
      // Still save the form data even if geocoding fails
      const updatedFormData = {
        ...formData,
        hasRegistered: true,
      };

      // Perform storage updates without coordinates
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === formData.id);

      if (userIndex >= 0) {
        users[userIndex] = updatedFormData;
      } else {
        users.push(updatedFormData);
      }

      localStorage.setItem("users", JSON.stringify(users));
      sessionStorage.setItem("user", JSON.stringify(updatedFormData));
      setUser(updatedFormData);
    }
  };

  const handleImageSave = () => {
    handleInputChange("profile_image", tempImageUrl);
    setIsModalOpen(false);
  };

  const renderPersonalInfo = () => (
    <>
      <div
        className="profile-image-circle"
        onClick={() => setIsModalOpen(true)}
        style={{
          backgroundImage: formData.profile_image
            ? `url(${formData.profile_image})`
            : "none",
        }}
      >
        {!formData.profile_image && <Edit />}
      </div>

      <Modal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Title>Add Profile Image URL</Modal.Title>
        <Modal.Content>
          <Input
            width="100%"
            value={tempImageUrl}
            onChange={(e) => setTempImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setIsModalOpen(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={handleImageSave}>Save</Modal.Action>
      </Modal>

      <br />

      <div className="flex-fields">
        <div
          style={{
            width: "100%",
          }}
        >
          <Input
            width="100%"
            //   value={formData.first_name}
            //   onChange={(e) => handleInputChange("first_name", e.target.value)}
            placeholder="John"
            {...register("first_name")}
          >
            First Name
          </Input>
          {errors.first_name && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          <Input
            width="100%"
            //   value={formData.surname}
            //   onChange={(e) => handleInputChange("surname", e.target.value)}
            placeholder="Smith"
            {...register("surname")}
          >
            Surname
          </Input>
          {errors.surname && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.surname.message}
            </p>
          )}
        </div>
      </div>
      <br />

      <div className="flex-fields">
        <div
          style={{
            width: "100%",
          }}
        >
          <Input
            width="100%"
            //   value={formData.username}
            //   onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="johnsmith1988"
            {...register("username")}
          >
            Username
          </Input>
          {errors.username && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.username.message}
            </p>
          )}
        </div>
        <div
          style={{
            width: "100%",
          }}
        >
          <Input
            width="100%"
            icon={<Phone />}
            //   value={formData.phone}
            //   onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+44 123 456 7890"
            {...register("phone_number")}
          >
            Phone Number
          </Input>
          {errors.phone_number && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.phone_number.message}
            </p>
          )}
        </div>
      </div>
      <br />
      <Divider>
        <span style={{ fontWeight: "400", color: "#444" }}>Address</span>
      </Divider>
      <br />
      <div className="address-fields">
        <div className="flex-fields">
          <div className="with-label">
            <label>Country</label>
            <Select
              width="calc(100% - 16px)"
              //   value={formData.country}
              //   onChange={(e) => handleInputChange("country", e)}
              placeholder="Select Country"
            >
              {countryChoices.map((choice) => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Input
            width="100%"
            // value={formData.postcode}
            // onChange={(e) => handleInputChange("postcode", e.target.value)}
            placeholder="Postcode"
          >
            Postcode
          </Input>
        </div>
        <div className="flex-fields">
          <Input
            width="100%"
            // value={formData.address}
            // onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Address"
          >
            Address
          </Input>
          <Input
            width="100%"
            // value={formData.city}
            // onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="City"
          >
            City
          </Input>
        </div>
      </div>

      <br />
      <button type="button" onClick={() => setCurrentStep("profile")}>
        Next
      </button>
    </>
  );
  const renderProfileDetails = () => (
    <div className="profile-details">
      <div className="flex-fields">
        <Toggle
          checked={formData.available}
          onChange={(e) => handleInputChange("available", e.target.checked)}
        ></Toggle>
        Available for Opportunities
      </div>

      <div className="select-fields">
        <div
          style={{
            width: "100%",
          }}
        >
          <Select
            width="98.6%"
            placeholder="Select User Type"
            //   value={formData.user_type}
            //   onChange={(val) => handleInputChange("user_type", val)}
            {...register("user_type")}
          >
            <Select.Option value="individual">Individual</Select.Option>
            <Select.Option value="business">Business</Select.Option>
            <Select.Option value="influencer">Influencer</Select.Option>
          </Select>
          {errors.user_type && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.user_type.message}
            </p>
          )}
        </div>

        <div style={{ width: "100%" }}>
          <Select
            width="98.6%"
            placeholder="Select Industry"
            //   value={formData.industry}
            //   onChange={(val) => handleInputChange("industry", val)}
            {...register("industryChoices")}
          >
            {industryChoices.map((choice) => (
              <Select.Option key={choice.value} value={choice.value}>
                {choice.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div
          style={{
            width: "100%",
          }}
        >
          <Select
            width="98.6%"
            placeholder="Select Tags"
            //   value={formData.tags}
            //   onChange={(val) => handleInputChange("tags", val)}
            multiple
            scale={0.9}
            {...register("tags")}
          >
            {tagChoices.map((choice) => (
              <Select.Option key={choice.value} value={choice.value}>
                {choice.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* <Select 
                    
                    placeholder="Select Specialized Tags xyz"
                    value={formData.specialized_tags}
                    onChange={(val) => handleInputChange('specialized_tags', val)}
                    multiple
                    scale={0.9}
                >
                    {tagChoices.map(choice => (
                        <Select.Option key={choice.value} value={choice.value}>
                            {choice.label}
                        </Select.Option>
                    ))}
                </Select> */}
      </div>

      <div style={{ width: "100%" }} className="with-label">
        <label>Bio</label>
        <Textarea
          width="100%"
          //   value={formData.bio}
          //   onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Enter Bio"
        />
      </div>

      <button type="button" onClick={() => setCurrentStep("contact")}>
        Next
      </button>
    </div>
  );
  const renderContactInfo = () => (
    <>
      <div className="social-media-inputs">
        <div>
          <Input
            width="100%"
            icon={<Linkedin />}
            // value={formData.linkedin}
            // onChange={(e) => handleInputChange("linkedin", e.target.value)}
            placeholder="LinkedIn URL"
            {...register("linkedin")}
          >
            LinkedIn
          </Input>
          {errors.linkedin && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.linkedin.message}
            </p>
          )}
        </div>
        <div>
          <Input
            width="100%"
            icon={<Github />}
            // value={formData.github}
            // onChange={(e) => handleInputChange("github", e.target.value)}
            placeholder="GitHub URL"
            {...register("github")}
          >
            GitHub
          </Input>
          {errors.github && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.github.message}
            </p>
          )}
        </div>
        <div>
          <Input
            width="100%"
            icon={<Twitter />}
            // value={formData.twitter}
            // onChange={(e) => handleInputChange("twitter", e.target.value)}
            placeholder="Twitter URL"
            {...register("twitter")}
          >
            Twitter
          </Input>
          {errors.twitter && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.twitter.message}
            </p>
          )}
        </div>
        <div>
          <Input
            width="100%"
            icon={<ExternalLink />}
            // value={formData.instagram}
            // onChange={(e) => handleInputChange("instagram", e.target.value)}
            placeholder="Instagram URL"
            {...register("instagram")}
          >
            Instagram
          </Input>
          {errors.instagram && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.instagram.message}
            </p>
          )}
        </div>
        <div>
          <Input
            width="100%"
            icon={<ExternalLink />}
            // value={formData.youtube}
            // onChange={(e) => handleInputChange("youtube", e.target.value)}
            placeholder="YouTube URL"
            {...register("youtube")}
          >
            YouTube
          </Input>
          {errors.youtube && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.youtube.message}
            </p>
          )}
        </div>
        <div>
          <Input
            width="100%"
            icon={<ExternalLink />}
            // value={formData.tiktok}
            // onChange={(e) => handleInputChange("tiktok", e.target.value)}
            placeholder="TikTok URL"
            {...register("tiktok")}
          >
            TikTok
          </Input>
          {errors.tiktok && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {errors.tiktok.message}
            </p>
          )}
        </div>
      </div>
      <br />
      <button type="submit">Complete</button>
    </>
  );

  const renderStepNavigation = () => (
    <div className="step-navigation">
      <button
        type="button"
        className={currentStep === "personal" ? "active" : ""}
        onClick={() => setCurrentStep("personal")}
      >
        Personal Info
      </button>
      <button
        type="button"
        className={currentStep === "profile" ? "active" : ""}
        onClick={() => setCurrentStep("profile")}
      >
        Profile Details
      </button>
      <button
        type="button"
        className={currentStep === "contact" ? "active" : ""}
        onClick={() => setCurrentStep("contact")}
      >
        Contact Info
      </button>
    </div>
  );

  return (
    <div className="register-form">
      <div>
        <h1>
          Create a <span>profile</span>
        </h1>
        {renderStepNavigation()}
      </div>
      <form onSubmit={handleSubmit}>
        {currentStep === "personal" && renderPersonalInfo()}
        {currentStep === "contact" && renderContactInfo()}
        {currentStep === "profile" && renderProfileDetails()}
      </form>
    </div>
  );
}
