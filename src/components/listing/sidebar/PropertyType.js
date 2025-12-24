'use client'

import React from "react";

const PropertyType = ({filterFunctions}) => {

  const options = [

    { label: "Houses" },

    { label: "Apartments", defaultChecked: true },
    { label: "Office" },
    { label: "Villa" },
   
  ];

  return (
    <>
    <label className="custom_checkbox"  >
          All
          <input type="checkbox"
          checked={!filterFunctions?.categories.length}
          onChange={(e=>{filterFunctions?.handlecategories("All")})}
  />
          <span className="checkmark" />
        </label>
      {options.map((option, index) => (
        <label className="custom_checkbox" key={index} >
          {option.label}
          <input type="checkbox"
          checked={filterFunctions?.categories.includes(option.label)}
          onChange={(e=>{filterFunctions.handlecategories(option.label)})}
  />
          <span className="checkmark" />
        </label>
      ))}
    </>
  );
};

export default PropertyType;
