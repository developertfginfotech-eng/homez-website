"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = {
  countries: [
    "Belgium",
    "France",
    "Kuwait",
    "Qatar",
    "Netherlands",
    "Germany",
    "Turkey",
    "UK",
    "United Kingdom",
    "USA",
    "Japan",
    "Canada",
    "Australia",
    "India",
  ],
  cities: [
    "California",
    "Chicago",
    "Los Angeles",
    "Manhattan",
    "New Jersey",
    "New York",
    "San Diego",
    "San Francisco",
    "Texas",
    "London",
    "Paris",
    "Tokyo",
    "Dubai",
    "Toronto",
  ],
  additionalCountries: [
    "Belgium",
    "France",
    "Kuwait",
    "Qatar",
    "Netherlands",
    "Germany",
    "Turkey",
    "UK",
    "United Kingdom",
    "USA",
    "Japan",
    "Canada",
    "Australia",
    "India",
  ],
};

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
  const [countryState, setCountryState] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    setShowSelect(true);
  }, []);

  const fieldTitles = ["Country / State", "City", "Country"];
  const placeholders = ["Search or select country/state...", "Search or select city...", "Search or select country..."];
  const fieldNames = ["countryState", "city", "country"];

  const handleSelectChange = (index, selectedOption) => {
    if (index === 0) setCountryState(selectedOption);
    if (index === 1) setCity(selectedOption);
    if (index === 2) setCountry(selectedOption);
  };

  return (
    <>
      {Object.keys(options).map((key, index) => (
        <div className="col-sm-6 col-xl-4" key={index}>
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              {fieldTitles[index]}
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
                  placeholder={placeholders[index]}
                  value={index === 0 ? countryState : index === 1 ? city : country}
                  onChange={(opt) => handleSelectChange(index, opt)}
                  options={options[key].map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
              )}
            </div>
          </div>
          <input type="hidden" name={fieldNames[index]} value={index === 0 ? countryState?.value || "" : index === 1 ? city?.value || "" : country?.value || ""} />
        </div>
      ))}
    </>
  );
};

export default SelectMultiField;
