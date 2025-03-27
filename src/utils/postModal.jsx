import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from '@geist-ui/icons'
import { Select, Slider, Collapse, Input, Spacer } from '@geist-ui/core'
import '../styles/PostModal.css'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// google maps imports & variables
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Circle,
} from '@react-google-maps/api'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete'

const libraries = ['places']
const mapContainerStyle = {
  height: '100px',
  // width: "100vw",
}
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}
const circleOptions = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
}
// const myLocation =   navigator.geolocation.getCurrentPosition((position) => panTo({lat: position.coords.latitude,lng: position.coords.longitude,}));
// const myLatitude =   navigator.geolocation.getCurrentPosition((position) => position.coords.latitude);

// console.log(myLatitude,"mylocation")

const center = {
  lat: 0,
  lng: 0,
}
navigator.geolocation.getCurrentPosition((position) => {
  const myLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  }

  // console.log(myLocation, "my location");

  // Update center with myLocation values
  center.lat = myLocation.lat
  center.lng = myLocation.lng

  // console.log(center, "updated center");
})
// google maps imports & variables

const ExploreFormSchema = z.object({
  opportunity_type: z.string().min(1, 'opportunity type is required'),
  industry: z.string().min(1, 'industry selection is required'),
  radius: z.string().min(1, 'radius selection is required'),
  tags: z.array().min(1, 'radius selection is required'),
})

import {
  opportunityTypeChoices,
  industryChoices,
  tagChoices,
} from '@/utils/constants'
import CustomSelect from '@/components/ui/CustomSelect'
import clientAxios from '@/api/axios'

const formatListingsData = (data) => {
  return data.map((user) => ({
    image: `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? 'women' : 'men'
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
  }))
}

export default function PostModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const minSliderValue = 50
  const maxSliderValue = 100
  const modalRef = useRef()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    opportunity_type: initialData?.opportunity_type || '',
    industry: initialData?.industry || '',
    description: initialData?.description || '',
    radius: initialData?.radius || 100,
    tags: initialData?.tags || [],
    specializedTags: initialData?.specializedTags || [],
  })
  const {
    register,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    defaultValues: {
      opportunity_type: '',
      industry: '',
      radius: 100,
      tags: [],
    },
  })
  const { fields } = useFieldArray({
    control,
    name: 'tags',
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
  })

  // google maps states hooks and functions
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [addressValue, setAddressValue] = useState('')
  const [selectedLocation, setSelectedLocation] = useState({
    house: '',
    street_name: '',
    route: '',
    area: '',
    postal_code: '',
    city: '',
    country: '',
    address: '',
  })
  const [searchLocationValue, setSearchLocationValue] = useState('')
  const clickedLocation = markers.map((marker) => marker)
  console.log(markers, 'selected lat lng')
  const { house, street_name, route, area, postal_code, city, country } =
    selectedLocation
  console.log(
    house,
    street_name,
    route,
    area,
    postal_code,
    city,
    country,
    'slected city and country'
  )

  const fetchGeocodeResults = async () => {
    try {
      const results = await Promise.all(
        markers.map((marker) =>
          getGeocode({ location: { lat: marker.lat, lng: marker.lng } })
        )
      )

      // Extract city and country from the results
      results.forEach((result) => {
        if (result.length > 0) {
          const addressComponents = result[0].address_components

          console.log(addressComponents, 'address component')

          let city = ''
          let country = ''
          let area = ''
          let route = ''
          let postal_code = ''
          let street_name = ''
          let house = ''

          addressComponents.forEach((component) => {
            if (component.types.includes('street_number')) {
              house = component.long_name
            }
            if (component.types.includes('establishment')) {
              street_name = component.long_name
            }
            if (component.types.includes('postal_code')) {
              postal_code = component.long_name
            }
            if (component.types.includes('route')) {
              route = component.long_name
            }
            if (component.types.includes('sublocality')) {
              area = component.long_name
            }
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('country')) {
              country = component.long_name
            }
            setSelectedLocation({
              house: house,
              city: city,
              country: country,
              area: area,
              route: route,
              postal_code: postal_code,
              street_name: street_name,
              address: result[0].formatted_address,
            })
          })

          console.log(
            'City:',
            city,
            'Country:',
            country,
            'Area:',
            area,
            'route:',
            route,
            'postal:',
            postal_code,
            'street name:',
            street_name
          )
        }
      })
    } catch (error) {
      console.error('Error fetching geocode results:', error)
    }
  }

  const onMapClick = useCallback((e) => {
    console.log(e.latLng.lat(), 'latitude')
    console.log(e.latLng.lng(), 'longitude')
    setMarkers((current) => [
      // ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ])
  }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng })
    mapRef.current.setZoom(14)
    setMarkers((current) => [
      // ...current,
      {
        lat,
        lng,
        time: new Date(),
      },
    ])
  }, [])
  // google maps states hooks and functions

  useEffect(() => {
    const fetchUserData = async () => {
      const data = JSON.parse(sessionStorage.getItem('user'))
      setUserData(data)
    }
    fetchUserData()
  }, [])

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
      setIsDataLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }

    if (markers.length > 0) {
      fetchGeocodeResults()
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, isSubmitting, markers])

  // Modified handleSliderChange to update temporary state
  const handleSliderChange = (name, value) => {
    setSliderValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault()
    // setIsSubmitting(true);

    // Prepare the data in the required format
    const requestData = {
      opportunity_type: formData.opportunity_type,
      industry: formData.industry,
      country: userData?.country || '',
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
      origin: 'post',
      description: formData.description,
    }

    try {
      // Only call API for new posts, not for edits
      if (!initialData) {
        const { data } = await clientAxios.post(
          '/account/listings/',
          requestData
        )

        // console.log('Data from API:', data);
        // console.log('Formatted data:', formatListingsData(data));
        // Store the data in localStorage
        const formattedListings = formatListingsData(data)
        localStorage.setItem(
          'exploreListings',
          JSON.stringify(formattedListings)
        )
        sessionStorage.setItem('hasExplored', 'true')
      }

      // Create the post object
      const newPost = {
        id: initialData?.id || crypto.randomUUID(),
        name: userData?.name || 'Anonymous',
        image: userData?.profile_image || '/default_profile_image.jpg',
        opportunity_type:
          formData?.opportunity_type || initialData?.opportunity_type || '',
        industry: formData?.industry || initialData?.industry || '',
        country: userData?.country || '',
        radius: formData?.radius || initialData?.radius || 100,
        score: Math.round(
          (sliderValues.opportunityTypeSlider + sliderValues.industrySlider) / 2
        ),
        description: formData?.description || initialData?.description || '',
        labels: [
          ...(formData?.tags || initialData?.labels[0] || ''),
          ...(formData?.specializedTags || initialData?.labels[1] || ''),
        ],
        timestamp: initialData?.timestamp || new Date().toISOString(),
        views: initialData?.views || 0,
        applications: initialData?.applications || [],
        engagementRate: initialData?.engagementRate || '0%',

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
        origin: 'post',
      }

      onSubmit(newPost)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      // setIsSubmitting(false);
      if (!initialData) {
        navigate('/explore')
      }
    }
  }

  const [newTag, setNewTag] = useState(null)
  const [searchTagInputValue, setSearchTagInputValue] = useState(null)
  const [tags, setTags] = useState(tagChoices)
  const handleTagSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase()

    setSearchTagInputValue(e.target.value)

    const foundTag = tagChoices.filter(
      (choice) =>
        choice.value.toLowerCase().includes(searchQuery) ||
        choice.label.toLowerCase().includes(searchQuery)
    )

    setFormData((prev) => ({
      ...prev,
      tags: foundTag.map((tag) => tag),
    }))
  }
  const handleAddNewTag = () => {
    if (
      searchTagInputValue &&
      !tags.some((tag) => tag.value === searchTagInputValue)
    ) {
      const newTag = {
        id: new Date().getTime(),
        value: searchTagInputValue,
        label: searchTagInputValue,
      }

      setTags((prevTags) => [newTag, ...prevTags])
    }
  }
  const onAddressChange = (e) => {
    setAddressValue(e.target.value)
  }

  if (!isOpen || !isDataLoaded) return null
  if (loadError) return 'Error'
  if (!isLoaded) return 'Loading...'
  return (
    <div className="modal-overlay" onClick={(e) => !isSubmitting && onClose()}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2>{initialData ? 'Edit Post' : 'Create New Post'}</h2>
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
                initialValue={initialData?.opportunity_type || ''}
                // onChange={(value) =>
                //   handleSelectChange("opportunity_type", value)
                // }
                {...register('opportunity_type')}
              >
                {opportunityTypeChoices.map((choice) => (
                  <Select.Option key={choice.value} value={choice.value}>
                    {choice.label}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Select Industry"
                initialValue={initialData?.industry || ''}
                // onChange={(value) => handleSelectChange("industry", value)}
                {...register('industry')}
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
                  handleSliderChange('opportunityTypeSlider', val)
                }
              />
            </div>

            <div className="form-group">
              <label>Industry Impact</label>
              <Slider
                min={minSliderValue}
                max={maxSliderValue}
                initialValue={initialData?.industrySlider * 100 || 50}
                onChange={(val) => handleSliderChange('industrySlider', val)}
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
                      width={'100%'}
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
                  onChange={(val) => handleSliderChange('tagEffectSlider', val)}
                />
              </div>
            </Collapse>

            {/* Distance Group */}
            {/* <Collapse title="Distance" bordered>
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
            </Collapse> */}
            <Collapse title="Distance" bordered>
              {/* <Search selectedLocation={selectedLocation} searchLocationValue={searchLocationValue} markers={markers} clickedLocation={clickedLocation} panTo={panTo} /> */}
              <Spacer h={1}></Spacer>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  // alignItems: "center",
                  gap: '14px',
                }}
              >
                <Input
                  name="radius"
                  initialValue={formData.radius}
                  htmlType="number"
                  // onChange={handleRadiusChange}
                  placeholder="Radius"
                  {...register('radius')}
                  width="100%"
                />
                {/* <Input
                  value={
                    house !== "" ||
                    street_name !== "" ||
                    route !== "" ||
                    area !== "" ||
                    postal_code !== "" ||
                    city !== "" ||
                    country !== ""
                      ? `${house} ${street_name} ${route} ${area} ${postal_code} ${city} ${country}`
                      : addressValue
                  }
                  placeholder="Address"
                  width="100%"
                  // {...register("address")}
                  style={{
                    color: "black",
                  }}
                  onChange={onAddressChange}
                /> */}
                <Search
                  selectedLocation={selectedLocation}
                  searchLocationValue={searchLocationValue}
                  markers={markers}
                  clickedLocation={clickedLocation}
                  panTo={panTo}
                />
              </div>
              <div
                style={{
                  display: 'none',
                }}
              >
                <Spacer h={1}></Spacer>
                <GoogleMap
                  id="map"
                  mapContainerStyle={mapContainerStyle}
                  zoom={8}
                  center={center}
                  options={options}
                  onClick={onMapClick}
                  onLoad={onMapLoad}
                >
                  {markers.map((marker) => (
                    <>
                      <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => {
                          setSelected(marker)
                        }}
                        // icon={{
                        //   url: `/bear.svg`,
                        //   origin: new window.google.maps.Point(0, 0),
                        //   anchor: new window.google.maps.Point(15, 15),
                        //   scaledSize: new window.google.maps.Size(30, 30)
                        // }}
                      />
                      <Circle
                        center={{ lat: marker.lat, lng: marker.lng }}
                        radius={sliderValues.radiusSlider}
                        options={circleOptions}
                        onCenterChanged={() => console.log('onCenterChanged')}
                        onRadiusChanged={() => console.log('onRadiusChanged')}
                        min={minSliderValue}
                        max={maxSliderValue}
                      />
                    </>
                  ))}

                  {selected ? (
                    <InfoWindow
                      position={{ lat: selected.lat, lng: selected.lng }}
                      onCloseClick={() => {
                        setSelected(null)
                      }}
                    >
                      <div>
                        <h2>
                          <span role="img" aria-label="bear">
                            🐻
                          </span>{' '}
                          Alert
                        </h2>
                        {/* <p>Spotted {formatRelative(selected.time, new Date())}</p> */}
                      </div>
                    </InfoWindow>
                  ) : null}
                </GoogleMap>
              </div>
              <br />
              <Spacer h={1}></Spacer>
              <div>
                <label>Radius Slider</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={sliderValues.radiusSlider}
                  onChange={(value) =>
                    handleSliderChange('radiusSlider', value)
                  }
                />
              </div>
              <Spacer h={1} inline></Spacer>
              <div>
                <label>Country Slider</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={sliderValues.countrySlider}
                  onChange={(value) =>
                    handleSliderChange('countrySlider', value)
                  }
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
                  onChange={(val) => handleSliderChange('businessSlider', val)}
                />
              </div>

              <div className="form-group">
                <label>Influencer Impact</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={initialData?.influencerSlider * 100 || 50}
                  onChange={(val) =>
                    handleSliderChange('influencerSlider', val)
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
                    handleSliderChange('individualSlider', val)
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
                handleSelectChange('description', e.target.value)
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
                ? 'Loading...'
                : initialData
                ? 'Save Changes'
                : 'Create Post'}{' '}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Search = ({
  panTo,
  selectedLocation,
  searchLocationValue,
  markers,
  clickedLocation,
}) => {
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
  })

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
  const [showSuggestions, setShowSuggestions] = useState(false)
  useEffect(() => {
    // console.log('Location', selectedLocation)
    // if(selectedLocation.address) {
    //   setValue(selectedLocation.address);
    // }
    if (data.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [data, selectedLocation])

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleSelect = async (address) => {
    setValue(address)
    clearSuggestions()
    // setShowSuggestions(false)
    setTimeout(() => setValue(null), 10)

    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      panTo({ lat, lng })
    } catch (error) {
      console.log('😱 Error: ', error)
    }
  }
  const { street_name, route, area, postal_code, city, country } =
    selectedLocation

  useEffect(() => {
    const fetchAddress = async () => {
      if (markers.length > 0) {
        const lastMarker = markers[markers.length - 1] // Get the latest marker
        try {
          const results = await getGeocode({ location: lastMarker })
          if (results.length > 0) {
            const address = results[0].formatted_address
            setValue(address) // Update the search input
          }
        } catch (error) {
          console.log('Error getting address: ', error)
        }
      }
    }

    fetchAddress()
    setTimeout(() => setValue(null), 10)
  }, [markers]) // Run effect when markers change

  return (
    <div
      className="search"
      style={{
        position: 'relative',
        width: '100%',
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
            // position: "absolute",
            top: '22px',
            left: '0',
            background: 'white',
            height: 'fit-content',
            // width: "fit-content",
            zIndex: '999',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #dedede',
          }}
        >
          {status === 'OK' &&
            data.map((mapData) => (
              // console.log(mapData,"map")
              <li
                key={mapData.id}
                style={{
                  listStyleType: 'none',
                }}
                onClick={() => handleSelect(mapData.description)}
              >
                <button className="googleSearchLocationSuggest">
                  {mapData.description}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
