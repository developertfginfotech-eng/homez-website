"use client";
import React, { useState } from "react";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import { addProperty } from "@/helpers/propertyApi";
import { useRouter } from "next/navigation";

const AddPropertyTabContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Get all form inputs
      const form = e.currentTarget;
      const inputs = form.querySelectorAll("input[name], textarea[name], select[name]");
      const data = {};

      inputs.forEach((input) => {
        if (input.name) {
          data[input.name] = input.value;
        }
      });

      // Get checked amenities
      const amenitiesCheckboxes = document.querySelectorAll('input[name="amenity"]:checked');
      const amenities = Array.from(amenitiesCheckboxes).map(cb => cb.value);

      // Prepare the property data
      const propertyData = {
        title: data.title || "",
        description: data.description || "",
        category: data.category ? [data.category] : [],
        listedIn: data.listedIn || "Active",
        propertyStatus: data.propertyStatus || "Published",
        price: parseFloat(data.price) || 0,
        yearlyTaxRate: parseFloat(data.yearlyTaxRate) || 0,
        afterPriceLabel: data.afterPriceLabel || "",
        imagesText: data.images || "",
        videoUrl: data.videoUrl || "",
        videoOption: data.videoOption || "youtube",
        address: data.address || "",
        countryState: data.countryState || "",
        city: data.city || "",
        country: data.country || "",
        zipCode: data.zipCode || "",
        neighborhood: data.neighborhood || "",
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        sizeInFt: parseFloat(data.sizeInFt) || 0,
        lotSizeInFt: parseFloat(data.lotSizeInFt) || 0,
        rooms: parseInt(data.rooms) || 0,
        bedrooms: parseInt(data.bedrooms) || 0,
        bathrooms: parseInt(data.bathrooms) || 0,
        customId: data.customId || "",
        garages: parseInt(data.garages) || 0,
        garageSize: parseFloat(data.garageSize) || 0,
        yearBuilt: parseInt(data.yearBuilt) || 0,
        availableFrom: data.availableFrom || "",
        basement: data.basement || "",
        extraDetails: data.extraDetails || "",
        roofing: data.roofing || "",
        exteriorMaterial: data.exteriorMaterial || "",
        structureType: data.structureType || "",
        floorsNo: parseInt(data.floorsNo) || 0,
        energyClass: data.energyClass || "",
        energyIndex: parseFloat(data.energyIndex) || 0,
        ownerAgentNotes: data.ownerAgentNotes || "",
        amenities: amenities,
      };

      const response = await addProperty(propertyData);

      if (response.success) {
        setSuccess("Property added successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard-my-properties");
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to add property. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb30" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show mb30" role="alert">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <nav>
          <div className="nav nav-tabs" id="nav-tab2" role="tablist">
            <button
              className="nav-link active fw600 ms-3"
              id="nav-item1-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-item1"
              type="button"
              role="tab"
              aria-controls="nav-item1"
              aria-selected="true"
            >
              1. Description
            </button>
            <button
              className="nav-link fw600"
              id="nav-item2-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-item2"
              type="button"
              role="tab"
              aria-controls="nav-item2"
              aria-selected="false"
            >
              2. Media
            </button>
            <button
              className="nav-link fw600"
              id="nav-item3-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-item3"
              type="button"
              role="tab"
              aria-controls="nav-item3"
              aria-selected="false"
            >
              3. Location
            </button>
            <button
              className="nav-link fw600"
              id="nav-item4-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-item4"
              type="button"
              role="tab"
              aria-controls="nav-item4"
              aria-selected="false"
            >
              4. Detail
            </button>
            <button
              className="nav-link fw600"
              id="nav-item5-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-item5"
              type="button"
              role="tab"
              aria-controls="nav-item5"
              aria-selected="false"
            >
              5. Amenities
            </button>
          </div>
        </nav>
        {/* End nav tabs */}

        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-item1"
            role="tabpanel"
            aria-labelledby="nav-item1-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Property Description</h4>
              <PropertyDescription />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item2"
                  >
                    Next: Media →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Property Description */}

          <div
            className="tab-pane fade"
            id="nav-item2"
            role="tabpanel"
            aria-labelledby="nav-item2-tab"
          >
            <UploadMedia />
            <div className="row mt30">
              <div className="col-12 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-item1"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-item3"
                >
                  Next: Location →
                </button>
              </div>
            </div>
          </div>
          {/* End tab for Upload photos of your property */}

          <div
            className="tab-pane fade"
            id="nav-item3"
            role="tabpanel"
            aria-labelledby="nav-item3-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Location</h4>
              <LocationField />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item2"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item4"
                  >
                    Next: Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Listing Location */}

          <div
            className="tab-pane fade"
            id="nav-item4"
            role="tabpanel"
            aria-labelledby="nav-item4-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Listing Details</h4>
              <DetailsFiled />
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item3"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item5"
                  >
                    Next: Amenities →
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Listing Details */}

          <div
            className="tab-pane fade"
            id="nav-item5"
            role="tabpanel"
            aria-labelledby="nav-item5-tab"
          >
            <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
              <h4 className="title fz17 mb30">Select Amenities</h4>
              <div className="row">
                <Amenities />
              </div>
              <div className="row mt30">
                <div className="col-12 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-item4"
                  >
                    ← Previous
                  </button>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit Property"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End tab for Select Amenities */}
        </div>
      </form>
    </>
  );
};

export default AddPropertyTabContent;
