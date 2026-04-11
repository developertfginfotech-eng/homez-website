"use client";
import { useTranslate } from "@/hooks/useTranslate";
import OverView from "@/components/property/property-single-style/common/OverView";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyAddress from "@/components/property/property-single-style/common/PropertyAddress";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";

export default function PropertySections({ id }) {
  const { t } = useTranslate();

  return (
    <div className="col-lg-8">
      {/* Overview Section */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">{t('propertyDetails.overview')}</h4>
        <div className="row">
          <OverView id={id} />
        </div>
      </div>

      {/* Property Description Section */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">{t('propertyDetails.propertyDescription')}</h4>
        <ProperytyDescriptions />

        <h4 className="title fz17 mb30 mt50">{t('propertyDetails.propertyDetails')}</h4>
        <div className="row">
          <PropertyDetails />
        </div>
      </div>

      {/* Address Section */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30 mt30">{t('propertyDetails.address')}</h4>
        <div className="row">
          <PropertyAddress />
        </div>
      </div>

      {/* Features Section */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">{t('propertyDetails.features')}</h4>
        <div className="row">
          <PropertyFeaturesAminites />
        </div>
      </div>
    </div>
  );
}
