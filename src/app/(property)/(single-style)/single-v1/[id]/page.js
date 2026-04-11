import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import NearbySimilarProperty from "@/components/property/property-single-style/common/NearbySimilarProperty";
import PropertyHeader from "@/components/property/property-single-style/common/PropertyHeader";
import ReviewBoxForm from "@/components/property/property-single-style/common/ReviewBoxForm";
import AllReviews from "@/components/property/property-single-style/common/reviews";
import ContactWithAgent from "@/components/property/property-single-style/sidebar/ContactWithAgent";
import ScheduleTour from "@/components/property/property-single-style/sidebar/ScheduleTour";
import PropertyGallery from "@/components/property/property-single-style/single-v1/PropertyGallery";
import PropertyDetailWrapper from "@/components/property/property-single-style/single-v1/PropertyDetailWrapper";
import PropertyValuation from "@/components/property/PropertyValuation";
import PropertyInvestmentScore from "@/components/property/PropertyInvestmentScore";
import NegotiationAssistant from "@/components/property/NegotiationAssistant";
import CrossCountryMatchWidget from "@/components/property/CrossCountryMatchWidget";
import React from "react";
import MortgageCalculator from "@/components/property/property-single-style/common/MortgageCalculator";
import ViewTracker from "@/components/property/ViewTracker";
import PropertyMarketForecast from "@/components/property/PropertyMarketForecast";
import AIAutoResponse from "@/components/property/AIAutoResponse";
import AgentMatchWidget from "@/components/property/AgentMatchWidget";

export const metadata = {
  title: "Property Single V1 || Globperty - Real Estate NextJS Template",
};

const SingleV1 = async props => {
  const params = await props.params;
  return (
    <>
      {/* Track property view */}
      <ViewTracker propertyId={params.id} />

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Property All Single V1 */}
      <section className="pt60 pb90 bgc-f7">
        <div className="container">
          <div className="row">
            <PropertyHeader id={params.id} />
          </div>
          {/* End .row */}

          <div className="row mb30 mt30">
            <PropertyGallery id={params.id}/>
          </div>
          {/* End .row */}

          <div className="row wrap">
            <div className="col-lg-8">
              <PropertyDetailWrapper id={params.id} />
              {/* End property details wrapper */}

              {/* AI Global Property Matches — real database listings from other countries */}
              <CrossCountryMatchWidget propertyId={params.id} />

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Mortgage Calculator</h4>
                <div className="row">
                  <MortgageCalculator />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <div className="row">
                  <AllReviews propertyId={params.id} />
                </div>
              </div>
              {/* End .ps-widget */}

              <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                <h4 className="title fz17 mb30">Leave A Review</h4>
                <div className="row">
                  <ReviewBoxForm propertyId={params.id} />
                </div>
              </div>
              {/* End .ps-widget */}
            </div>
            {/* End .col-8 */}

            <div className="col-lg-4">
              <div className="column">
                <div className="default-box-shadow1 bdrs12 bdr1 p30 mb30-md bgc-white position-relative">
                  <h4 className="form-title mb5">Schedule a tour</h4>
                  <p className="text">Choose your preferred day</p>
                  <ScheduleTour />
                </div>
                {/* End .Schedule a tour */}

                <div className="agen-personal-info position-relative bgc-white default-box-shadow1 bdrs12 p30 mt30">
                  <div className="widget-wrapper mb-0">
                    <h6 className="title fz17 mb30">Get More Information</h6>
                    <ContactWithAgent />
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
            </div>
          </div>
          {/* End .row */}

          <div className="row mt30 align-items-center justify-content-between">
            <div className="col-auto">
              <div className="main-title">
                <h2 className="title">Discover Our Featured Listings</h2>
                <p className="paragraph">
                  Aliquam lacinia diam quis lacus euismod
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
      {/* End Property All Single V1  */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
};

export default SingleV1;
