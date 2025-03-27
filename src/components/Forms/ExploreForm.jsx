import React, { useState, useEffect, useCallback } from 'react'
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
} from '@geist-ui/core' // Assuming Select is available
import {
  opportunityTypeChoices,
  industryChoices,
  tagChoices,
} from '@/utils/constants'
import { useRef } from 'react'
import CustomSelect from '../ui/CustomSelect'
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
import { getCategory } from '@/api/category'
import { getIndustry } from '@/api/industry'
import { getTags, getTagsByFilter, createTag } from '@/api/tags'

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

const ExploreForm = ({ onSubmit, loading }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [formData, setFormData] = useState({
    opportunity_type: '',
    industry: '',
    radius: 100,
    tags: [],
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

  // Separate slider state for better performance
  const minSliderValue = 50
  const maxSliderValue = 100
  const [sliderValues, setSliderValues] = useState({
    businessSlider: 50,
    influencerSlider: 50,
    individualSlider: 50,
    opportunityTypeSlider: 50,
    industrySlider: 50,
    countrySlider: 50,
    radiusSlider: 50,
    tagEffectSlider: 50,
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

  // const [userLocation, setUserLocation] = useState({
  //   country: "",
  //   latitude: 0,
  //   longitude: 0,
  // });
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    // setUserLocation({
    //   country: user.country || "",
    //   latitude: user.latitude || 0,
    //   longitude: user.longitude || 0,
    // });
  }, [])

  useEffect(() => {
    const previousSearch = sessionStorage.getItem('previousSearch')
    if (previousSearch) {
      setStartOpen(true)
      const parsedSearch = JSON.parse(previousSearch)
      setFormData((prevData) => ({
        ...prevData,
        opportunity_type: parsedSearch.opportunity_type || '',
        industry: parsedSearch.industry || '',
        radius: parsedSearch.radius || 100,
        tags: parsedSearch.tags || '',
        specializedTags: parsedSearch.specializedTags || '',
      }))

      setSliderValues((prevSliders) => ({
        ...prevSliders,
        businessSlider: Math.round(parsedSearch.businessSlider * 100 || 50),
        influencerSlider: Math.round(parsedSearch.influencerSlider * 100 || 50),
        individualSlider: Math.round(parsedSearch.individualSlider * 100 || 50),
        opportunityTypeSlider: Math.round(
          parsedSearch.opportunityTypeSlider * 100 || 50
        ),
        industrySlider: Math.round(parsedSearch.industrySlider * 100 || 50),
        countrySlider: Math.round(parsedSearch.countrySlider * 100 || 50),
        radiusSlider: Math.round(parsedSearch.radiusSlider * 100 || 50),
        tagEffectSlider: Math.round(parsedSearch.tagEffectSlider * 100 || 50),
      }))
    }
    setIsInitialized(true)

    if (markers.length > 0) {
      fetchGeocodeResults()
    }
  }, [markers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Modified to use sliderValues state
  const handleSliderChange = (name, value) => {
    setSliderValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    // Filter out any empty strings before setting the form data
    const cleanedValue = Array.isArray(value)
      ? value.filter((v) => v !== '')
      : value
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }))
    console.log(value, 'vaaaaaaluuueeee')
    // console.log(name,"vaaaaaaluuueeee")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const convertedData = {
      ...formData,
      ...sliderValues,
      businessSlider: Math.round(sliderValues.businessSlider / 100),
      influencerSlider: Math.round(sliderValues.influencerSlider / 100),
      individualSlider: Math.round(sliderValues.individualSlider / 100),
      opportunityTypeSlider: Math.round(
        sliderValues.opportunityTypeSlider / 100
      ),
      industrySlider: Math.round(sliderValues.industrySlider / 100),
      countrySlider: Math.round(sliderValues.countrySlider / 100),
      radiusSlider: Math.round(sliderValues.radiusSlider / 100),
      tagEffectSlider: Math.round(sliderValues.tagEffectSlider / 100),
      // country: userLocation.country,
      // latitude: userLocation.latitude,
      // longitude: userLocation.longitude,
    }

    // Save to sessionStorage
    sessionStorage.setItem('previousSearch', JSON.stringify(convertedData))

    onSubmit(convertedData)
  }

  const [newTag, setNewTag] = useState(null)
  const [fetchedTags, setFetchedTags] = useState([])
  const [searchTagInputValue, setSearchTagInputValue] = useState(null)
  const [tags, setTags] = useState(fetchedTags)
  const [isSearchedTagFound, setIsSearchedTagFound] = useState(false)
  const handleTagSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase()
    setSearchTagInputValue(e.target.value)

    getTagsByFilter(searchQuery).then((foundTags) => {
      if (foundTags.length < 1 && e.target.value.trim() !== '') {
        setIsSearchedTagFound(true)
      } else {
        setIsSearchedTagFound(false)
      }

      console.log({ foundTags })
      setFormData((prev) => ({ ...prev, tags: foundTags }))
    })
  }
  const handleAddNewTag = () => {
    createTag(searchTagInputValue).then((tag) => {
      setTags((prevTags) => [tag, ...prevTags])
      setFetchedTags((prevTags) => [tag, ...prevTags])

      getTagsByFilter(searchTagInputValue).then((foundTags) => {
        if (foundTags.length < 1 && searchTagInputValue.trim() !== '') {
          setIsSearchedTagFound(true)
        } else {
          setIsSearchedTagFound(false)
        }

        setFormData((prev) => ({ ...prev, tags: foundTags }))
      })
    })

    // if (
    //   searchTagInputValue &&
    //   !tags.some((tag) => tag.value === searchTagInputValue)
    // ) {
    //   const newTag = {
    //     id: new Date().getTime(),
    //     value: searchTagInputValue,
    //     label: searchTagInputValue,
    //   };

    //   setTags((prevTags) => [newTag, ...prevTags]);
    // }
  }
  console.log(newTag)

  const onAddressChange = (e) => {
    setAddressValue(e.target.value)
  }
  // const handleRadiusChange =(e)=>{
  //   setFormData((prev)=>({...prev,radius:e.target.value}))
  //   // setSliderValues((prev)=>({...prev,radiusSlider:e.target.value}))
  // }

  const [fetchedCategory, setFetchedCategory] = useState([])
  const [fetchedIndustry, setFetchedIndustry] = useState([])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category = await getCategory()
        setFetchedCategory(category)
      } catch (error) {
        console.log('error:', error)
      }
    }
    const fetchIndustry = async () => {
      try {
        const industry = await getIndustry()
        setFetchedIndustry(industry)
      } catch (error) {
        console.log('error:', error)
      }
    }
    const fetchTags = async () => {
      try {
        const tags = await getTags()
        setFetchedTags(tags)
      } catch (error) {
        console.log('error:', error)
      }
    }
    fetchCategory()
    fetchIndustry()
    fetchTags()
  }, [])

  if (!isInitialized) {
    return
  }
  if (loadError) return 'Error'
  if (!isLoaded) return 'Loading...'

  return (
    <>
      <Card className="prevent-select">
        <Text h3 style={{ fontWeight: '600', textAlign: 'center' }}>
          Find a Match
        </Text>
        <form onSubmit={handleSubmit} className="explore-form">
          <Collapse.Group accordion={true}>
            <Collapse title="Search Category" initialVisible={false}>
              <Select
                // name="opportunity_type"
                // initialValue={formData.opportunity_type}
                // onChange={(value) =>
                //   handleSelectChange("opportunity_type", value)
                // }
                {...register('opportunity_type')}
                placeholder="Select Opportunity Type"
              >
                {fetchedCategory.map((choice) => (
                  <Select.Option
                    key={choice.id.toString()}
                    value={choice.id.toString()}
                  >
                    {choice.name}
                  </Select.Option>
                ))}
              </Select>

              <Spacer h={0.1} inline></Spacer>

              <Select
                // name="industry"
                // initialValue={formData.industry}
                // onChange={(value) => handleSelectChange("industry", value)}
                placeholder="Select Industry"
                {...register('industry')}
              >
                {fetchedIndustry.map((choice) => (
                  <Select.Option
                    key={choice.id.toString()}
                    value={choice.id.toString()}
                  >
                    {choice.name}
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
                    handleSliderChange('opportunityTypeSlider', value)
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
                    handleSliderChange('industrySlider', value)
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
                    width={'100%'}
                    name="tag"
                    placeholder="Search Tags"
                    onChange={handleTagSearch}
                  />
                }
                formDataTags={formData.tags}
                formData={fetchedTags}
                tagChoices={fetchedTags}
                handleAddNewTag={handleAddNewTag}
                isSearchedTagFound={isSearchedTagFound}
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
                    handleSliderChange('tagEffectSlider', value)
                  }
                />
              </div>
            </Collapse>

            <Collapse title="Distance" bordered>
              {/* <Search selectedLocation={selectedLocation} searchLocationValue={searchLocationValue} markers={markers} clickedLocation={clickedLocation} panTo={panTo} /> */}
              {/* <Spacer h={1}></Spacer> */}
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
                        // key={`${marker.lat}-${marker.lng}`}
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

            <Collapse title="User type" bordered>
              <div>
                <label>Business Slider</label>
                <Slider
                  min={minSliderValue}
                  max={maxSliderValue}
                  initialValue={sliderValues.businessSlider}
                  onChange={(value) =>
                    handleSliderChange('businessSlider', value)
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
                    handleSliderChange('influencerSlider', value)
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
                    handleSliderChange('individualSlider', value)
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
    </>
  )
}

export default ExploreForm

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
        value={value || ''}
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
