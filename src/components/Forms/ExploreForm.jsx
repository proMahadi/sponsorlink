import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Slider,
  Select,
  Card,
  Text,
  Divider,
  Spacer,
  Collapse,
} from "@geist-ui/core"; // Assuming Select is available
import {
  opportunityTypeChoices,
  industryChoices,
  tagChoices,
} from "@/utils/constants";
import { useRef } from "react";
import CustomSelect from "../ui/CustomSelect";

const ExploreForm = ({ onSubmit, loading }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [formData, setFormData] = useState({
    opportunity_type: "",
    industry: "",
    radius: 100,
    tags: [],
    specializedTags: [],
  });

  // Separate slider state for better performance
  const minSliderValue = 50;
  const maxSliderValue = 100;
  const [sliderValues, setSliderValues] = useState({
    businessSlider: 50,
    influencerSlider: 50,
    individualSlider: 50,
    opportunityTypeSlider: 50,
    industrySlider: 50,
    countrySlider: 50,
    radiusSlider: 50,
    tagEffectSlider: 50,
  });

  const [userLocation, setUserLocation] = useState({
    country: "",
    latitude: 0,
    longitude: 0,
  });
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUserLocation({
      country: user.country || "",
      latitude: user.latitude || 0,
      longitude: user.longitude || 0,
    });
  }, []);

  useEffect(() => {
    const previousSearch = sessionStorage.getItem("previousSearch");
    if (previousSearch) {
      setStartOpen(true);
      const parsedSearch = JSON.parse(previousSearch);
      setFormData((prevData) => ({
        ...prevData,
        opportunity_type: parsedSearch.opportunity_type || "",
        industry: parsedSearch.industry || "",
        radius: parsedSearch.radius || 100,
        tags: parsedSearch.tags || "",
        specializedTags: parsedSearch.specializedTags || "",
      }));

      setSliderValues((prevSliders) => ({
        ...prevSliders,
        businessSlider: parsedSearch.businessSlider * 100 || 50,
        influencerSlider: parsedSearch.influencerSlider * 100 || 50,
        individualSlider: parsedSearch.individualSlider * 100 || 50,
        opportunityTypeSlider: parsedSearch.opportunityTypeSlider * 100 || 50,
        industrySlider: parsedSearch.industrySlider * 100 || 50,
        countrySlider: parsedSearch.countrySlider * 100 || 50,
        radiusSlider: parsedSearch.radiusSlider * 100 || 50,
        tagEffectSlider: parsedSearch.tagEffectSlider * 100 || 50,
      }));
    }
    setIsInitialized(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Modified to use sliderValues state
  const handleSliderChange = (name, value) => {
    setSliderValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    // Filter out any empty strings before setting the form data
    const cleanedValue = Array.isArray(value)
      ? value.filter((v) => v !== "")
      : value;
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    console.log(value, "vaaaaaaluuueeee");
    // console.log(name,"vaaaaaaluuueeee")
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const convertedData = {
      ...formData,
      ...sliderValues,
      businessSlider: sliderValues.businessSlider / 100,
      influencerSlider: sliderValues.influencerSlider / 100,
      individualSlider: sliderValues.individualSlider / 100,
      opportunityTypeSlider: sliderValues.opportunityTypeSlider / 100,
      industrySlider: sliderValues.industrySlider / 100,
      countrySlider: sliderValues.countrySlider / 100,
      radiusSlider: sliderValues.radiusSlider / 100,
      tagEffectSlider: sliderValues.tagEffectSlider / 100,
      country: userLocation.country,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };

    // Save to sessionStorage
    sessionStorage.setItem("previousSearch", JSON.stringify(convertedData));

    onSubmit(convertedData);
  };

  const [newTag, setNewTag] = useState(null);
  const [searchTagInputValue, setSearchTagInputValue] = useState(null);
  const [tags, setTags] = useState(tagChoices);
  const handleTagSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();

   
      setSearchTagInputValue(e.target.value)
   

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
    if (searchTagInputValue && !tags.some(tag => tag.value === searchTagInputValue)) {
      const newTag = {
        id: new Date().getTime(),
        value: searchTagInputValue,
        label: searchTagInputValue,
      };
  
      setTags((prevTags) => [newTag, ...prevTags]); 
    }
  };
  console.log(newTag)

  if (!isInitialized) {
    return;
  }

  return (
    <Card className="prevent-select">
      <Text h3 style={{ fontWeight: "600", textAlign: "center" }}>
        Find a Match
      </Text>
      <form onSubmit={handleSubmit} className="explore-form">
        <Collapse.Group accordion={true}>
          <Collapse title="Search Category" initialVisible={false}>
            <Select
              name="opportunity_type"
              initialValue={formData.opportunity_type}
              onChange={(value) =>
                handleSelectChange("opportunity_type", value)
              }
              placeholder="Select Opportunity Type"
            >
              {opportunityTypeChoices.map((choice) => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select>

            <Spacer h={0.1} inline></Spacer>

            <Select
              name="industry"
              initialValue={formData.industry}
              onChange={(value) => handleSelectChange("industry", value)}
              placeholder="Select Industry"
            >
              {industryChoices.map((choice) => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select>

            <br />
            <Spacer h={0.1} inline></Spacer>

            <div>
              <label>Opportunity Type Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.opportunityTypeSlider}
                onChange={(value) =>
                  handleSliderChange("opportunityTypeSlider", value)
                }
              />
            </div>

            <Spacer h={0.1} inline></Spacer>

            <div>
              <label>Industry Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.industrySlider}
                onChange={(value) =>
                  handleSliderChange("industrySlider", value)
                }
              />
            </div>
          </Collapse>

          <Collapse
            title="Tags"
            bordered
            // style={{
            //   position: "relative",
            // }}
          >
            {/* <Input
              width={"100%"}
              name="tag"
              placeholder="Search Tags"
              onChange={handleTagSearch}
            /> */}
            {/* {formData.tags.length > 0  && (
              <ul
                style={{
                  background: "white",
                  padding: "12px",
                  border: "1px solid #dedede",
                  position: "absolute",
                  width: "92.5%",
                  zIndex: "9999",
                  top: "100px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {formData.tags.map((tag) => (
                  // console.log(tag)
                  <li>
                    <a   style={{ color: "black", padding:"12px 0px" }}>{tag}</a>
                  </li>
                ))}
              </ul>
            )} */}
            {/* <Spacer h={0.5}></Spacer> */}
            {/* <Select
              width={"95%"}
              name="tags"
              // initialValue={formData.tags}
              onChange={(value) => handleSelectChange("tags", value)}
              placeholder="Select Tags"
              multiple
              scale={0.8}
            >
              {formData.tags.length > 0
                ? formData.tags.map((tag) => (
                    <Select.Option key={tag} value={tag}>
                      {tag}
                    </Select.Option>
                  ))
                : tagChoices.map((choice) => (
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

            {/* <Spacer h={0.1} inline></Spacer> */}

            {/* <Select name="specializedTags" initialValue={formData.specializedTags} onChange={(value) => handleSelectChange('specializedTags', value)} placeholder="Select Specialized Tags" multiple scale={0.8}>
              {tagChoices.map((choice) => (
                <Select.Option key={choice.value} value={choice.value}>
                  {choice.label}
                </Select.Option>
              ))}
            </Select> */}

            <br />
            <Spacer h={1}></Spacer>

            <div>
              <label>Tag Effect Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.tagEffectSlider}
                onChange={(value) =>
                  handleSliderChange("tagEffectSlider", value)
                }
              />
            </div>
          </Collapse>

          <Collapse title="Distance" bordered>
            <Input
              name="radius"
              initialValue={formData.radius}
              htmlType="number"
              onChange={handleChange}
              placeholder="Radius"
            />
            <br />
            <Spacer h={1}></Spacer>
            <div>
              <label>Radius Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.radiusSlider}
                onChange={(value) => handleSliderChange("radiusSlider", value)}
              />
            </div>
            <Spacer h={1} inline></Spacer>
            <div>
              <label>Country Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.countrySlider}
                onChange={(value) => handleSliderChange("countrySlider", value)}
              />
            </div>
          </Collapse>

          <Collapse title="User type" bordered>
            <div>
              <label>Business Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.businessSlider}
                onChange={(value) =>
                  handleSliderChange("businessSlider", value)
                }
              />
            </div>
            <Spacer h={0.1} inline></Spacer>
            <div>
              <label>Influencer Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.influencerSlider}
                onChange={(value) =>
                  handleSliderChange("influencerSlider", value)
                }
              />
            </div>
            <Spacer h={0.1} inline></Spacer>
            <div>
              <label>Individual Slider</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={sliderValues.individualSlider}
                onChange={(value) =>
                  handleSliderChange("individualSlider", value)
                }
              />
            </div>
          </Collapse>
        </Collapse.Group>

        <Button
          color="red"
          ghost
          type="success"
          htmlType="submit"
          loading={loading}
          scale={0.85}
        >
          Explore
        </Button>
      </form>
    </Card>
  );
};

export default ExploreForm;
