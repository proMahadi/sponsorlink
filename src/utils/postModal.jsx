import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "@geist-ui/icons";
import { Select, Slider, Collapse, Input } from "@geist-ui/core";
import "../styles/PostModal.css";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ExploreFormSchema = z.object({
  opportunity_type: z.string().min(1, "opportunity type is required"),
  industry: z.string().min(1, "industry selection is required"),
  radius: z.string().min(1, "radius selection is required"),
  tags: z.array().min(1, "radius selection is required"),
});


import {
  opportunityTypeChoices,
  industryChoices,
  tagChoices,
} from "@/utils/constants";
import CustomSelect from "@/components/ui/CustomSelect";

const formatListingsData = (data) => {
  return data.map((user) => ({
    image: `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? "women" : "men"
    }/${Math.floor(Math.random() * 100)}.jpg`,
    name: user.name,
    user_type: user.user_type,
    opportunity_type: user.opportunity_type,
    industry: user.industry,
    labels: [...user.tags, ...user.specialized_tags],
    country: user.country,
    distance: user.distance,
    score: Math.floor(user.pHd * 100),
    description: `A ${user.user_type} specializing in ${user.industry}.`,
  }));
};

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const minSliderValue = 50;
  const maxSliderValue = 100;
  const modalRef = useRef();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    opportunity_type: initialData?.opportunity_type || "",
    industry: initialData?.industry || "",
    description: initialData?.description || "",
    radius: initialData?.radius || 100,
    tags: initialData?.tags || [],
    specializedTags: initialData?.specializedTags || [],
  });
    const {
      register,
      control,
      formState: { errors, isLoading,isSubmitting},
    } = useForm({
      defaultValues: {
        opportunity_type: "",
        industry: "",
        radius: 100,
        tags: [],
      },
    });
    const {fields}=useFieldArray({
      control,
      name:"tags"
    })

  // New state for temporary slider values
  const [sliderValues, setSliderValues] = useState({
    businessSlider: initialData?.businessSlider || 50,
    influencerSlider: initialData?.influencerSlider || 50,
    individualSlider: initialData?.individualSlider || 50,
    opportunityTypeSlider: initialData?.opportunityTypeSlider || 50,
    industrySlider: initialData?.industrySlider || 50,
    countrySlider: initialData?.countrySlider || 50,
    radiusSlider: initialData?.radiusSlider || 50,
    tagEffectSlider: initialData?.tagEffectSlider || 50,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const data = JSON.parse(sessionStorage.getItem("user"));
      setUserData(data);
    };
    fetchUserData();
  }, []);

  // New useEffect to update slider values when formData changes
  // useEffect (() => {
  //     console.log('Form data changed:', formData);
  // }, [formData]);
  // useEffect (() => {
  //     console.log('Initial data loaded:', initialData);
  // }, [initialData]);

  useEffect(() => {
    if (
      opportunityTypeChoices.length > 0 &&
      industryChoices.length > 0 &&
      tagChoices.length > 0
    ) {
      setIsDataLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleEscape = (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isSubmitting]);

  // Modified handleSliderChange to update temporary state
  const handleSliderChange = (name, value) => {
    setSliderValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);

    // Prepare the data in the required format
    const requestData = {
      opportunity_type: formData.opportunity_type,
      industry: formData.industry,
      country: userData?.country || "",
      latitude: userData?.latitude || 0,
      longitude: userData?.longitude || 0,
      businessSlider: sliderValues.businessSlider / 100,
      influencerSlider: sliderValues.influencerSlider / 100,
      individualSlider: sliderValues.individualSlider / 100,
      opportunityTypeSlider: sliderValues.opportunityTypeSlider / 100,
      industrySlider: sliderValues.industrySlider / 100,
      countrySlider: sliderValues.countrySlider / 100,
      radius: parseInt(formData.radius),
      radiusSlider: sliderValues.radiusSlider / 100,
      tagEffectSlider: sliderValues.tagEffectSlider / 100,
      tags: formData.tags.map((tag) => ({
        name: tag,
        slider: sliderValues.tagEffectSlider / 100,
      })),
      specializedTags: formData.specializedTags.map((tag) => ({
        name: tag,
        slider: sliderValues.tagEffectSlider / 100,
      })),
      isApply: false,
      origin: "post",
      description: formData.description,
    };

    try {
      let data;
      // Only call API for new posts, not for edits
      if (!initialData) {
        const response = await fetch(
          "https://sponsorlink-backend.up.railway.app/api/bayes/getOrderedUsers/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        data = await response.json();
        // console.log('Data from API:', data);
        // console.log('Formatted data:', formatListingsData(data));
        // Store the data in localStorage
        const formattedListings = formatListingsData(data);
        localStorage.setItem(
          "exploreListings",
          JSON.stringify(formattedListings)
        );
        sessionStorage.setItem("hasExplored", "true");
      }

      // Create the post object
      const newPost = {
        id: initialData?.id || crypto.randomUUID(),
        name: userData?.name || "Anonymous",
        image: userData?.profile_image || "/default_profile_image.jpg",
        opportunity_type:
          formData?.opportunity_type || initialData?.opportunity_type || "",
        industry: formData?.industry || initialData?.industry || "",
        country: userData?.country || "",
        radius: formData?.radius || initialData?.radius || 100,
        score: Math.round(
          (sliderValues.opportunityTypeSlider + sliderValues.industrySlider) / 2
        ),
        description: formData?.description || initialData?.description || "",
        labels: [
          ...(formData?.tags || initialData?.labels[0] || ""),
          ...(formData?.specializedTags || initialData?.labels[1] || ""),
        ],
        timestamp: initialData?.timestamp || new Date().toISOString(),
        views: initialData?.views || 0,
        applications: initialData?.applications || [],
        engagementRate: initialData?.engagementRate || "0%",

        businessSlider: sliderValues.businessSlider / 100,
        influencerSlider: sliderValues.influencerSlider / 100,
        individualSlider: sliderValues.individualSlider / 100,
        opportunityTypeSlider: sliderValues.opportunityTypeSlider / 100,
        industrySlider: sliderValues.industrySlider / 100,
        countrySlider: sliderValues.countrySlider / 100,
        radiusSlider: sliderValues.radiusSlider / 100,
        tagEffectSlider: sliderValues.tagEffectSlider / 100,
        latitude: userData?.latitude || 0,
        longitude: userData?.longitude || 0,
        isApply: false,
        origin: "post",
      };

      onSubmit(newPost);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // setIsSubmitting(false);
      if (!initialData) {
        navigate("/explore");
      }
    }
  };

  const [newTag, setNewTag] = useState(null);
  const [searchTagInputValue, setSearchTagInputValue] = useState(null);
  const [tags, setTags] = useState(tagChoices);
  const handleTagSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();

    setSearchTagInputValue(e.target.value);

    const foundTag = tagChoices.filter(
      (choice) =>
        choice.value.toLowerCase().includes(searchQuery) ||
        choice.label.toLowerCase().includes(searchQuery)
    );

    setFormData((prev) => ({
      ...prev,
      tags: foundTag.map((tag) => tag),
    }));
  };
  const handleAddNewTag = () => {
    if (
      searchTagInputValue &&
      !tags.some((tag) => tag.value === searchTagInputValue)
    ) {
      const newTag = {
        id: new Date().getTime(),
        value: searchTagInputValue,
        label: searchTagInputValue,
      };

      setTags((prevTags) => [newTag, ...prevTags]);
    }
  };

  if (!isOpen || !isDataLoaded) return null;
  return (
    <div className="modal-overlay" onClick={(e) => !isSubmitting && onClose()}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2>{initialData ? "Edit Post" : "Create New Post"}</h2>
          <button
            className="close-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <Collapse.Group accordion={true}>
            <div className="form-group">
              <Select
                placeholder="Select Opportunity Type"
                initialValue={initialData?.opportunity_type || ""}
                // onChange={(value) =>
                //   handleSelectChange("opportunity_type", value)
                // }
                {...register("opportunity_type")}
              >
                {opportunityTypeChoices.map((choice) => (
                  <Select.Option key={choice.value} value={choice.value}>
                    {choice.label}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Select Industry"
                initialValue={initialData?.industry || ""}
                // onChange={(value) => handleSelectChange("industry", value)}
                {...register("industry")}
              >
                {industryChoices.map((choice) => (
                  <Select.Option key={choice.value} value={choice.value}>
                    {choice.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="form-group">
              <label>Opportunity Type Impact</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={initialData?.opportunityTypeSlider * 100 || 50}
                onChange={(val) =>
                  handleSliderChange("opportunityTypeSlider", val)
                }
              />
            </div>

            <div className="form-group">
              <label>Industry Impact</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={initialData?.industrySlider * 100 || 50}
                onChange={(val) => handleSliderChange("industrySlider", val)}
              />
            </div>

            {/* Tags Group */}
            <Collapse title="Tags" bordered>
              <div className="form-group">
                {/* <Select multiple 
                  initialValue={initialData?.labels[0] || []}
                  scale={0.9}
                  placeholder="Select Tags"
                  onChange={(value) => handleSelectChange('tags', value)}
                >
                  {tagChoices.map(choice => (
                    <Select.Option key={choice.value} value={choice.value}>
                      {choice.label}
                    </Select.Option>
                  ))}
                </Select>

                <Select multiple 
                  initialValue={initialData?.labels[1] || []}
                  scale={0.9}
                  placeholder="Select Specialized Tags"
                  onChange={(value) => handleSelectChange('specializedTags', value)}>
                  {tagChoices.map(choice => (
                    <Select.Option key={choice.value} value={choice.value}>
                      {choice.label}
                    </Select.Option>
                  ))}
                </Select> */}
                <CustomSelect
                  searchComponent={
                    <Input
                      value={searchTagInputValue}
                      width={"100%"}
                      name="tag"
                      placeholder="Search Tags"
                      onChange={handleTagSearch}
                    />
                  }
                  formDataTags={formData.tags}
                  formData={formData}
                  tagChoices={tags}
                  handleAddNewTag={handleAddNewTag}
                />
              </div>

              <div className="form-group">
                <label>Tag Effect</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.tagEffectSlider * 100 || 50}
                  onChange={(val) => handleSliderChange("tagEffectSlider", val)}
                />
              </div>
            </Collapse>

            {/* Distance Group */}
            <Collapse title="Distance" bordered>
              <div className="form-group">
                <label>Radius</label>
                <input
                  type="number"
                  defaultValue={initialData?.radius || 100}
                  // onChange={(e) => handleSelectChange("radius", e.target.value)}
                  {...register("radius")}
                />
              </div>

              <div className="form-group">
                <label>Radius Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.radiusSlider * 100 || 50}
                  onChange={(val) => handleSliderChange("radiusSlider", val)}
                />
              </div>

              <div className="form-group">
                <label>Country Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.countrySlider * 100 || 50}
                  onChange={(val) => handleSliderChange("countrySlider", val)}
                />
              </div>
            </Collapse>

            {/* User Type Group */}
            <Collapse title="User Type" bordered>
              <div className="form-group">
                <label>Business Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.businessSlider * 100 || 50}
                  onChange={(val) => handleSliderChange("businessSlider", val)}
                />
              </div>

              <div className="form-group">
                <label>Influencer Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.influencerSlider * 100 || 50}
                  onChange={(val) =>
                    handleSliderChange("influencerSlider", val)
                  }
                />
              </div>

              <div className="form-group">
                <label>Individual Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.individualSlider * 100 || 50}
                  onChange={(val) =>
                    handleSliderChange("individualSlider", val)
                  }
                />
              </div>
            </Collapse>
          </Collapse.Group>

          <div className="form-group">
            <label>Description</label>
            <textarea
              defaultValue={initialData?.description}
              onChange={(e) =>
                handleSelectChange("description", e.target.value)
              }
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Loading..."
                : initialData
                ? "Save Changes"
                : "Create Post"}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
