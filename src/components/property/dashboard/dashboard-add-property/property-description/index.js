"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const PropertyDescription = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [category, setCategory] = useState(null);
  const [listedInValue, setListedInValue] = useState(null);
  const [propertyStatusValue, setPropertyStatusValue] = useState(null);

  const catergoryOptions = [
    { value: "Apartments", label: "Apartments" },
    { value: "Bungalow", label: "Bungalow" },
    { value: "Houses", label: "Houses" },
    { value: "Loft", label: "Loft" },
    { value: "Office", label: "Office" },
    { value: "Townhome", label: "Townhome" },
    { value: "Villa", label: "Villa" },
  ];
  const listedIn = [
    { value: "All Listing", label: "All Listing" },
    { value: "Active", label: "Active" },
    { value: "Sold", label: "Sold" },
    { value: "Processing", label: "Processing" },
  ];
  const PropertyStatus = [
    { value: "All Cities", label: "All Cities" },
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Published", label: "Published" },
  ];

  useEffect(() => {
    setShowSelect(true);
  }, []);

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
    <div className="form-style1">
      <div className="row">
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Property Title"
            />
          </div>
        </div>
        {/* End .col-12 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Property Type
            </label>
            <select name="propertyType" className="form-control">
              <option value="">Select Type</option>
              <option value="Rent">Rent</option>
              <option value="Sale">Sale</option>
            </select>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Description
            </label>
            <textarea
              cols={30}
              rows={5}
              name="description"
              placeholder="There are many variations of passages."
              defaultValue={""}
            />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Select Category
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={category}
                  onChange={(opt) => setCategory(opt)}
                  options={catergoryOptions}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  required
                  isSingleValue={true}
                  isMulti={false}
                />
              )}
            </div>
            <input type="hidden" name="category" value={category?.value || ""} />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Listed in
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={listedInValue}
                  onChange={(opt) => setListedInValue(opt)}
                  options={listedIn}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  required
                  isSingleValue={true}
                  isMulti={false}
                />
              )}
            </div>
            <input type="hidden" name="listedIn" value={listedInValue?.value || "Active"} />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Property Status
            </label>
            <div className="location-area">
              {showSelect && (
                <Select
                  value={propertyStatusValue}
                  onChange={(opt) => setPropertyStatusValue(opt)}
                  options={PropertyStatus}
                  styles={customStyles}
                  className="select-custom pl-0"
                  classNamePrefix="select"
                  required
                  isSingleValue={true}
                  isMulti={false}
                />
              )}
            </div>
            <input type="hidden" name="propertyStatus" value={propertyStatusValue?.value || "Published"} />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Price in $
            </label>
            <input
              type="text"
              name="price"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Yearly Tax Rate
            </label>
            <input
              type="text"
              name="yearlyTaxRate"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              After Price Label
            </label>
            <input
              type="text"
              name="afterPriceLabel"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-6 */}
      </div>
    </div>
  );
};

export default PropertyDescription;
