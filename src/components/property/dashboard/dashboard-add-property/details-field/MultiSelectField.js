"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = {
  floorNo: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
  energyClass: ["A", "B", "C", "D", "E", "F", "G"],
  energyIndex: ["20", "30", "40", "50", "60", "65", "75", "85", "95"],
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

const MultiSelectField = () => {
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);

  const fieldTitles = ["Floors no", "Energy Class", "Energy index in kWh/m2a"];
  const placeholders = ["Select floors...", "Search or select energy class...", "Search or select energy index..."];

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
                  isMulti
                  isSearchable={true}
                  isClearable={true}
                  placeholder={placeholders[index]}
                  options={options[key].map((item) => ({
                    value: item,
                    label: item,
                  }))}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MultiSelectField;
