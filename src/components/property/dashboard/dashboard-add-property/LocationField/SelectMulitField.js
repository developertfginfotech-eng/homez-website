"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  getAllCountries,
  getStatesByCountry,
  getCitiesByCountry,
} from "@/data/locationData";

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isHovered
        ? "#eb675312"
        : isFocused
        ? "#eb675312"
        : undefined,
    };
  },
};

const SelectMultiField = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    // Load all countries
    const allCountries = getAllCountries();
    setCountries(allCountries);
    setShowSelect(true);
  }, []);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setSelectedState(null);
    setSelectedCity(null);

    if (selectedOption && selectedOption.value) {
      const countryStates = getStatesByCountry(selectedOption.value);
      setStates(countryStates);
      const countryCities = getCitiesByCountry(selectedOption.value);
      setCities(countryCities);
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  const stateOptions = states.map((state) => ({
    value: state,
    label: state,
  }));

  const cityOptions = cities.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <>
      {/* Country Select */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            Country
          </label>
          <div className="location-area">
            {showSelect && (
              <Select
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                required
                isSingleValue={true}
                isMulti={false}
                isSearchable={true}
                isClearable={true}
                placeholder="Search or select country..."
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryOptions}
              />
            )}
          </div>
          <input
            type="hidden"
            name="country"
            value={selectedCountry?.value || ""}
          />
        </div>
      </div>

      {/* State/Province Select */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">
            {selectedCountry?.value === "India" ? "State" : "State / Province"}
          </label>
          <div className="location-area">
            {showSelect && (
              <Select
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isSingleValue={true}
                isMulti={false}
                isSearchable={true}
                isClearable={true}
                isDisabled={!selectedCountry}
                placeholder={
                  selectedCountry
                    ? "Search or select state..."
                    : "Select country first"
                }
                value={selectedState}
                onChange={handleStateChange}
                options={stateOptions}
              />
            )}
          </div>
          <input
            type="hidden"
            name="countryState"
            value={selectedState?.value || ""}
          />
        </div>
      </div>

      {/* City Select */}
      <div className="col-sm-6 col-xl-4">
        <div className="mb20">
          <label className="heading-color ff-heading fw600 mb10">City</label>
          <div className="location-area">
            {showSelect && (
              <Select
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isSingleValue={true}
                isMulti={false}
                isSearchable={true}
                isClearable={true}
                isDisabled={!selectedCountry}
                placeholder={
                  selectedCountry
                    ? "Search or select city..."
                    : "Select country first"
                }
                value={selectedCity}
                onChange={handleCityChange}
                options={cityOptions}
              />
            )}
          </div>
          <input
            type="hidden"
            name="city"
            value={selectedCity?.value || ""}
          />
        </div>
      </div>
    </>
  );
};

export default SelectMultiField;
