"use client";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import PropertyDetailsForm from "@/components/property/PropertyDetailsForm";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const DashboardEditProperty = () => {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(`${API_URL}/property/${propertyId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setPropertyData(data.property);
        } else {
          setError(data.message || "Failed to load property");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handlePropertyUpdate = async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/property/${propertyId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Property updated and submitted for approval!");
        router.push("/dashboard-my-properties");
      } else {
        throw new Error(data.message || "Failed to update property");
      }
    } catch (err) {
      console.error("Error updating property:", err);
      alert("Failed to update property: " + err.message);
    }
  };

  return (
    <>
      {/* Main Header Nav */}
      <DashboardHeader />

      {/* Mobile Menu */}
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content property-page bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb40">
                <div className="col-lg-12">
                  <div className="dashboard_title_area">
                    <h2>Edit Property</h2>
                    <p className="text">
                      Update your property details. After saving, your property will be resubmitted for admin approval.
                    </p>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3">Loading property details...</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && propertyData && (
                <div className="row">
                  <div className="col-xl-12">
                    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
                      <PropertyDetailsForm
                        initialData={propertyData}
                        onSubmit={handlePropertyUpdate}
                        isEditMode={true}
                        propertyId={propertyId}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEditProperty;
