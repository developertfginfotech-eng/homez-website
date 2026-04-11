"use client";

import DefaultHeader from "@/components/common/DefaultHeader";
import Footer from "@/components/common/default-footer";
import MobileMenu from "@/components/common/mobile-menu";
import ProperteyFiltering from "@/components/listing/grid-view/grid-full-3-col/ProperteyFiltering";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GridFull3ColInner() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || searchParams.get("city") || "";
  const type = searchParams.get("type") || "All";
  const beds = searchParams.get("beds") || "";
  const propertyType = searchParams.get("propertyType") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const isInvest = searchParams.get("invest") === "true";
  const gym = searchParams.get("gym") === "true";
  const pool = searchParams.get("pool") === "true";

  const buildTitle = () => {
    if (isInvest) return `Best Investment Properties${searchQuery ? ` in ${searchQuery}` : ""}`;

    const noun = [];
    if (beds) noun.push(`${beds} Bedroom`);
    if (propertyType) noun.push(propertyType);
    else noun.push("Properties");

    const amenities = [];
    if (gym) amenities.push("Gym");
    if (pool) amenities.push("Pool");
    const amenityText = amenities.length ? ` with ${amenities.join(" & ")}` : "";

    const forText = type === "Rent" ? "for Rent" : type === "All" ? "" : type === "Sold" ? "Sold" : "for Sale";
    let title = noun.join(" ") + amenityText + (forText ? ` ${forText}` : "");

    if (searchQuery) {
      const formattedLocation = searchQuery.split(",").map(s => s.trim()).join(" & ");
      title += ` in ${formattedLocation}`;
    }
    if (maxPrice) title += ` under $${Number(maxPrice).toLocaleString()}`;

    return title;
  };

  const pageTitle = buildTitle();

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
                <h2 className="title">{pageTitle}</h2>
                <div className="breadcumb-list">
                  <a href="/">Home</a>
                  <a href="#">Properties</a>
                </div>
                <a
                  className="filter-btn-left mobile-filter-btn d-block d-lg-none"
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                >
                  <span className="flaticon-settings" /> Filter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Breadcumb Sections */}

      {/* Property Filtering */}
      <ProperteyFiltering />
      {/* Property Filtering */}

      {/* Start Our Footer */}
      <section className="footer-style1 pt60 pb-0">
        <Footer />
      </section>
      {/* End Our Footer */}
    </>
  );
}

export default function GridFull3Col() {
  return (
    <Suspense fallback={null}>
      <GridFull3ColInner />
    </Suspense>
  );
}
