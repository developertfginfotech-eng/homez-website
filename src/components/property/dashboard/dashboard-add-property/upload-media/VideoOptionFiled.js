"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const videoField = [
  { value: "youtube", label: "Youtube" },
  { value: "facebook", label: "Facebook" },
  { value: "vimeo", label: "Vimeo" },
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

const VideoOptionFiled = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [videoOption, setVideoOption] = useState(videoField[0]);

  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <>
      <div className="col-sm-6 col-xl-4">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">
            Video from
          </label>
          <div className="location-area">
            {showSelect && (
              <Select
                value={videoOption}
                onChange={(opt) => setVideoOption(opt)}
                options={videoField}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isSingleValue={true}
                isMulti={false}
              />
            )}
          </div>
          <input type="hidden" name="videoOption" value={videoOption?.value || "youtube"} />
        </div>
      </div>
      <div className="col-sm-6 col-xl-4">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">
            Embed Video id
          </label>
          <input
            type="text"
            name="videoUrl"
            className="form-control"
            placeholder="Your Name"
          />
        </div>
      </div>
    </>
  );
};

export default VideoOptionFiled;
