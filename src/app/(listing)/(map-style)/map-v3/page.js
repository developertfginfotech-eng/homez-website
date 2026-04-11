import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";

import PropertyFilteringMapFour from "@/components/listing/map-style/map-v3/PropertyFilteringMapFour";

import React, { Suspense } from "react";

export const metadata = {
  title: "Map V3 || Globperty - Real Estate NextJS Template",
};

const MapV3 = () => {
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* start  filter sidebar */}
      <Suspense fallback={
        <div className="text-center p-5">
          <div className="spinner-border text-thm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }>
        <PropertyFilteringMapFour/>
      </Suspense>

      {/* Property Filtering */}
    </>
  );
};

export default MapV3;
