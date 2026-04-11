'use client';

import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import ProperteyFiltering from "@/components/listing/grid-view/grid-full-4-col/PropertyFiltering";
import React, { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { useTranslation } from "react-i18next";

function GridFull4ColInner() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const propertyType = searchParams.get('type');
  const listingStatus = searchParams.get('status');

  // Generate dynamic title
  const getTitle = () => {
    let title = t('listing.properties');
    if (propertyType) {
      const typeMap = {
        'House': 'propertyTypes.houses',
        'Houses': 'propertyTypes.houses',
        'Apartment': 'propertyTypes.apartments',
        'Apartments': 'propertyTypes.apartments',
        'Office': 'propertyTypes.office',
        'Villa': 'propertyTypes.villa',
      };
      title = typeMap[propertyType] ? t(typeMap[propertyType]) : propertyType;
    }
    if (listingStatus) {
      const status = listingStatus.toLowerCase() === 'sale' ? t('listing.forSale') : t('listing.forRent');
      title += ` ${status}`;
    } else {
      title += ` ${t('listing.forSale')} & ${t('listing.forRent')}`;
    }
    return title;
  };

  return (
    <>
      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Mobile Nav  */}
      <MobileMenu />
      {/* End Mobile Nav  */}

      {/* Breadcumb Sections */}
      <section className="breadcumb-section bgc-f7">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <h2 className="title">{getTitle()}</h2>
                <div className="breadcumb-list">
                  <a href="/">{t('nav.home')}</a>
                  <a href="#">
                    {listingStatus ? `${t('listing.forSale')} ${listingStatus}` : t('listing.properties')}
                  </a>
                </div>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> {t('listing.filter')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcumb Sections */}

      {/* Property Filtering */}
      <ProperteyFiltering/>

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
}

export default function GridFull4Col() {
  return (
    <Suspense fallback={null}>
      <GridFull4ColInner />
    </Suspense>
  );
}
