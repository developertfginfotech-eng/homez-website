"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const Location = ({ filterFunctions }) => {
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => {
    setShowSelect(true);
  }, []);
  const locationOptions = [
    { value: "All", label: "All Countries" },
    { value: "Australia", label: "Australia" },
    { value: "Canada", label: "Canada" },
    { value: "UAE", label: "UAE" },
    { value: "UK", label: "UK" },
    { value: "USA", label: "USA" },
  ];

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

  return (
    <>
      {" "}
      {showSelect && (
        <Select
          defaultValue={locationOptions[0]}
          name="colors"
          styles={customStyles}
          options={locationOptions}
          value={locationOptions.find(opt => opt.value === filterFunctions.location) || locationOptions[0]}
          className="select-custom filterSelect"
          classNamePrefix="select"
          onChange={(e) => filterFunctions?.handlelocation(e.value)}
          required
        />
      )}{" "}
    </>
  );
};

export default Location;
