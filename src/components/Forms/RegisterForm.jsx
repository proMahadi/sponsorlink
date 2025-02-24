import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Divider,
  Input,
  Select,
  Toggle,
  Textarea,
  Modal,
  AutoComplete,
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

// google maps imports & variables
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const libraries = ["places"];
const mapContainerStyle = {
  height: "300px",
  // width: "100vw",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
// const myLocation =   navigator.geolocation.getCurrentPosition((position) => panTo({lat: position.coords.latitude,lng: position.coords.longitude,}));
// const myLatitude =   navigator.geolocation.getCurrentPosition((position) => position.coords.latitude);

// console.log(myLatitude,"mylocation")

const center = {
  lat: 0,
  lng: 0,
};
navigator.geolocation.getCurrentPosition((position) => {
  const myLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };

  console.log(myLocation, "my location");

  // Update center with myLocation values
  center.lat = myLocation.lat;
  center.lng = myLocation.lng;

  console.log(center, "updated center");
});
// google maps imports & variables

//  <button
// className="locate"
// onClick={() => {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       panTo({
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       });
//     },
//     () => null
//   );
// }}
// >
// <img src="/compass.svg" alt="compass" />
// </button>

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
  address: z.string().min(1, "address is required"),
  city: z.string().min(1, "city is required"),
  country: z.string().min(1, "country is required"),
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

  // google maps states hooks and functions
  const { isLoaded, loadError } = useLoadScript({
    // googleMapsApiKey:"AIzaSyCIP2gFBWK0kxyEL5OFarGGfwlSkaiqC2c",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // googleMapsApiKey:`${import.meta.env.GOOGLE_MAPS_API_KEY}`,
    libraries,
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    street_name: "",
    route: "",
    area: "",
    postal_code: "",
    city: "",
    country: "",
    address: ""
  });
  console.log(markers, "selected lat lng");
  const { street_name, route, area, postal_code, city, country } =
    selectedLocation;
  console.log(
    street_name,
    route,
    area,
    postal_code,
    city,
    country,
    "slected city and country"
  );

  const fetchGeocodeResults = async () => {
    try {
      const results = await Promise.all(
        markers.map((marker) =>
          getGeocode({ location: { lat: marker.lat, lng: marker.lng } })
        )
      );

      // Extract city and country from the results
      results.forEach((result) => {
        if (result.length > 0) {
          const addressComponents = result[0].address_components;

          console.log(addressComponents, "address component");

          let city = "";
          let country = "";
          let area = "";
          let route = "";
          let postal_code = "";
          let street_name = "";

          addressComponents.forEach((component) => {
            if (component.types.includes("establishment")) {
              street_name = component.long_name;
            }
            if (component.types.includes("postal_code")) {
              postal_code = component.long_name;
            }
            if (component.types.includes("route")) {
              route = component.long_name;
            }
            if (component.types.includes("sublocality")) {
              area = component.long_name;
            }
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
            if (component.types.includes("country")) {
              country = component.long_name;
            }
            setSelectedLocation({
              city: city,
              country: country,
              area: area,
              route: route,
              postal_code: postal_code,
              street_name: street_name,
              address: result[0].formatted_address
            });
          });

          console.log(
            "City:",
            city,
            "Country:",
            country,
            "Area:",
            area,
            "route:",
            route,
            "postal:",
            postal_code,
            "street name:",
            street_name
          );
        }
      });
    } catch (error) {
      console.error("Error fetching geocode results:", error);
    }
  };
  // google maps states hooks and functions

  // useEffect(() => {
  //   if (markers.length > 0) {
  //     fetchGeocodeResults();
  //   }
  // }, [markers]);


  const onMapClick = useCallback((e) => {
    console.log(e.latLng.lat(), "latitude");
    console.log(e.latLng.lng(), "longitude");
    setMarkers((current) => [
      // ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    setMarkers((current) => [
      // ...current,
      {
        lat,
        lng,
        time: new Date(),
      },
    ]);
  }, []);

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
      address: "",
      city: "",
      country: "",
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

  // const { fields } = useFieldArray({
  //   control,
  //   name: "tags",
  // });

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
    if (markers.length > 0) {
      fetchGeocodeResults();
    }
  }, [User, markers]);

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
    // const { address, postcode, city, country } = formData;
    // const query = `${address}, ${postcode}, ${city}, ${country}`;
    // const apiKey = "1f64891487fe462d8161fc8f19befe87";
    // const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    //   query
    // )}&key=${apiKey}&no_annotations=1&language=en`;

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

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const renderPersonalInfo = () => {
    // const options = [
    //   { label: 'London', value: 'london' },
    //   { label: 'Sydney', value: 'sydney' },
    //   { label: 'Shanghai', value: 'shanghai' },
    // ]

    return (
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
          <span style={{ fontWeight: "400", color: "#444" }}>
            Enter your Address
          </span>
        </Divider>
        <br />
        <div className="address-fields">
          <div>
            {/* <Locate panTo={panTo} /> */}
            <div
              style={{
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Search selectedLocation={selectedLocation} panTo={panTo} />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Input
                  value={
                    street_name !== "" ||
                    route !== "" ||
                    area !== "" ||
                    postal_code !== "" ||
                    city !== "" ||
                    country !== ""
                      ? `${street_name} ${route} ${area} ${postal_code} ${city} ${country}`
                      : ""
                  }
                  placeholder="Address"
                  width="100%"
                  // {...register("address")}
                  style={{
                    color:"black"
                  }}
                />
                <Input
                  value={city}
                  placeholder="City"
                  width="100%"
                  // {...register("city")}
                />
                <Input
                  value={country}
                  placeholder="Country"
                  width="100%"
                  // {...register("country")}
                />
              </div>
            </div>

            <GoogleMap
              id="map"
              mapContainerStyle={mapContainerStyle}
              zoom={8}
              center={center}
              options={options}
              onClick={onMapClick}
              onLoad={onMapLoad}
              streetView={true}
            >
              {markers.map((marker) => (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => {
                    setSelected(marker);
                  }}
                  // icon={{
                  //   url: `/bear.svg`,
                  //   origin: new window.google.maps.Point(0, 0),
                  //   anchor: new window.google.maps.Point(15, 15),
                  //   scaledSize: new window.google.maps.Size(30, 30)
                  // }}
                />
              ))}

              {selected ? (
                <InfoWindow
                  position={{ lat: selected.lat, lng: selected.lng }}
                  onCloseClick={() => {
                    setSelected(null);
                  }}
                >
                  <div>
                    <h2>
                      <span role="img" aria-label="bear">
                        🐻
                      </span>{" "}
                      Alert
                    </h2>
                    {/* <p>Spotted {formatRelative(selected.time, new Date())}</p> */}
                  </div>
                </InfoWindow>
              ) : null}
            </GoogleMap>
          </div>
        </div>
        <br />
        <button type="button" onClick={() => setCurrentStep("profile")}>
          Next
        </button>
      </>
    );
  };
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

const Search = ({ panTo, selectedLocation }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    console.log('Location', selectedLocation)
    if(selectedLocation.address) {
      setValue(selectedLocation.address);
    }
    if (data.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [data, selectedLocation]);

  const handleInput = (e) => {
    setValue(e.target.value);
    
  };

  const handleSelect = async (address) => {
    setValue(address);
    clearSuggestions();
    // setShowSuggestions(false)
    setTimeout(() => setValue(null), 10);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };
  const { street_name, route, area, postal_code, city, country } =
    selectedLocation;

  return (
    <div
      className="search"
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search your location"
        width="100%"
      />

      {showSuggestions && (
        <ul
          style={{
            position: "absolute",
            top: "22px",
            left: "0",
            background: "white",
            height: "fit-content",
            // width: "fit-content",
            zIndex: "999",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #dedede",
          }}
        >
          {status === "OK" &&
            data.map((mapData) => (
              // console.log(mapData,"map")
              <li
                style={{
                  listStyleType: "none",
                }}
                onClick={() => handleSelect(mapData.description)}
                key={mapData.id}
              >
                <button className="googleSearchLocationSuggest">
                  {mapData.description}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
