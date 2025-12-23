import React from "react";
import MultiSelectField from "./MultiSelectField";
import StructureType from "./StructureType";

const DetailsFiled = () => {
  return (
    <div className="form-style1">
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Size in ft (only numbers)
            </label>
            <input
              type="text"
              name="sizeInFt"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Lot size in ft (only numbers)
            </label>
            <input
              type="text"
              name="lotSizeInFt"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Rooms</label>
            <input
              type="text"
              name="rooms"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bedrooms
            </label>
            <input
              type="text"
              name="bedrooms"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bathrooms
            </label>
            <input
              type="text"
              name="bathrooms"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Custom ID (text)
            </label>
            <input
              type="text"
              name="customId"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Garages
            </label>
            <input
              type="text"
              name="garages"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Garage size
            </label>
            <input
              type="text"
              name="garageSize"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Year built (numeric)
            </label>
            <input type="text" name="yearBuilt" className="form-control" />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Available from (date)
            </label>
            <input
              type="text"
              name="availableFrom"
              className="form-control"
              placeholder="99.aa.yyyy"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Basement
            </label>
            <input
              type="text"
              name="basement"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Extra details
            </label>
            <input
              type="text"
              name="extraDetails"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Roofing
            </label>
            <input
              type="text"
              name="roofing"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Exterior Material
            </label>
            <input
              type="text"
              name="exteriorMaterial"
              className="form-control"
              placeholder="Your Name"
            />
          </div>
        </div>
        {/* End .col-4 */}

        <StructureType />
      </div>
      {/* End .row */}

      <div className="row">
        <MultiSelectField />

        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Owner/ Agent nots (not visible on front end)
            </label>
            <textarea
              cols={30}
              rows={5}
              name="ownerAgentNotes"
              placeholder="There are many variations of passages."
              defaultValue={""}
            />
          </div>
        </div>
        {/* End .col-12 */}
      </div>
    </div>
  );
};

export default DetailsFiled;
