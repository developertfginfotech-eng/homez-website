"use client";

import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import NearbySimilarProperty from "@/components/property/property-single-style/common/NearbySimilarProperty";
import OverView from "@/components/property/property-single-style/common/OverView";
import PropertyAddress from "@/components/property/property-single-style/common/PropertyAddress";
import PropertyDetails from "@/components/property/property-single-style/common/PropertyDetails";
import PropertyFeaturesAminites from "@/components/property/property-single-style/common/PropertyFeaturesAminites";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import PropertyVideo from "@/components/property/property-single-style/common/PropertyVideo";
import ProperytyDescriptions from "@/components/property/property-single-style/common/ProperytyDescriptions";
import ContactWithAgent from "@/components/property/property-single-style/sidebar/ContactWithAgent";
import ScheduleTour from "@/components/property/property-single-style/sidebar/ScheduleTour";
import PropertyGallery from "@/components/property/property-single-style/single-v1/PropertyGallery";
import AllReviews from "@/components/property/property-single-style/common/reviews";
import ReviewBoxForm from "@/components/property/property-single-style/common/ReviewBoxForm";
import PropertyValuation from "@/components/property/PropertyValuation";
import PropertyInvestmentScore from "@/components/property/PropertyInvestmentScore";
import NegotiationAssistant from "@/components/property/NegotiationAssistant";
import CrossCountryMatchWidget from "@/components/property/CrossCountryMatchWidget";
import MortgageCalculator from "@/components/property/property-single-style/common/MortgageCalculator";
import ViewTracker from "@/components/property/ViewTracker";
import PropertyMarketForecast from "@/components/property/PropertyMarketForecast";
import AIAutoResponse from "@/components/property/AIAutoResponse";
import AgentMatchWidget from "@/components/property/AgentMatchWidget";
import { useTranslation } from "react-i18next";
import { use } from "react";

const SingleV7 = (props) => {
  const params = use(props.params);
  const { t } = useTranslation('common');
  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Property All Single V7 */}
      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row">
            <PropertyHeader id={params.id} />
          </div>
          {/* End .row */}

          <div className="row mb30 mt30">
            <PropertyGallery id={params.id} />
          </div>
          {/* End .row Gallery */}

          <div className="row wrap">
            <div className="col-lg-8">
              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">{t('propertyDetails.overview')}</h4>
                <div className="row">
                  <OverView id={params.id} />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">{t('propertyDetails.propertyDescription')}</h4>
                <ProperytyDescriptions />
                {/* End property description */}

                <h4 className="title fz17 mb30 mt50">{t('propertyDetails.propertyDetails')}</h4>
                <div className="row">
                  <PropertyDetails />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30 mt30">{t('propertyDetails.address')}</h4>
                <div className="row">
                  <PropertyAddress />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">{t('propertyDetails.features')}</h4>
                <div className="row">
                  <PropertyFeaturesAminites />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 ">
                <h4 className="title fz17 mb30">{t('propertyDetails.video')}</h4>
                <div className="row">
                  <PropertyVideo />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <div className="row">
                  <AllReviews />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">{t('propertyDetails.leaveAReview')}</h4>
                <div className="row">
                  <ReviewBoxForm />
                </div>
              </div>
              {/* End .ps-widget */}
            </div>
            {/* End .col-8 */}

            <div className="col-lg-4">
              <div className="column">
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <h6 className="title fz17 mb30">{t('propertyDetails.moreInformation')}</h6>
                    <ContactWithAgent propertyId={params.id} />
                  </div>
                </div>

                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <h6 className="title fz17 mb30">{t('propertyDetails.scheduleTour')}</h6>
                    <ScheduleTour />
                  </div>
                </div>

                {/* AI Property Valuation */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <PropertyValuation propertyId={params.id} currentPrice={0} />
                  </div>
                </div>

                {/* AI Investment Score */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <PropertyInvestmentScore propertyId={params.id} />
                  </div>
                </div>

                {/* AI Negotiation Assistant */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <NegotiationAssistant propertyId={params.id} />
                  </div>
                </div>

                {/* AI Cross-Country Match — real DB properties */}
                <CrossCountryMatchWidget propertyId={params.id} />

                {/* Mortgage Calculator */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <MortgageCalculator />
                  </div>
                </div>

                {/* AI Market Forecast */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <PropertyMarketForecast propertyId={params.id} />
                  </div>
                </div>

                {/* AI Auto Response */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <AIAutoResponse propertyId={params.id} />
                  </div>
                </div>

                {/* AI Agent Matching */}
                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <AgentMatchWidget propertyId={params.id} />
                  </div>
                </div>
              </div>
              <ViewTracker propertyId={params.id} />
            </div>
          </div>
          {/* End .row */}

          <div className="row mt30 align-items-center justify-content-between">
            <div className="col-auto">
              <div className="main-title">
                <h2 className="title">{t('sections2.discoverFeaturedListings')}</h2>
                <p className="paragraph">
                  {t('sections2.discoverFeaturedListingsDesc')}
                </p>
              </div>
            </div>
            {/* End header */}

            <div className="col-auto mb30">
              <div className="row align-items-center justify-content-center">
                <div className="col-auto">
                  <button className="featured-prev__active swiper_button">
                    <i className="far fa-arrow-left-long" />
                  </button>
                </div>
                {/* End prev */}

                <div className="col-auto">
                  <div className="pagination swiper--pagination featured-pagination__active" />
                </div>
                {/* End pagination */}

                <div className="col-auto">
                  <button className="featured-next__active swiper_button">
                    <i className="far fa-arrow-right-long" />
                  </button>
                </div>
                {/* End Next */}
              </div>
              {/* End .col for navigation and pagination */}
            </div>
            {/* End .col for navigation and pagination */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="property-city-slider">
                <NearbySimilarProperty currentPropertyId={params.id} />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Property All Single V7  */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default SingleV7;
