"use client";

import { propertiesAPI } from "@/services/api";
import React, { useState, useEffect } from "react";
import ListingSidebar from "../../sidebar";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeatuerdListings";
import PaginationTwo from "../../PaginationTwo";

export default function PropertyFilteringList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");

  const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([]);

  // Listen for currency changes
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'ALL';
    setSelectedCurrency(savedCurrency);

    const handleCurrencyChange = (e) => {
      setSelectedCurrency(e.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  // Get currency symbol based on country
  const getCurrency = (country) => {
    const currencyMap = {
      'UAE': 'AED',
      'United Arab Emirates': 'AED',
      'USA': '$',
      'United States': '$',
      'US': '$',
      'UK': '£',
      'United Kingdom': '£',
      'India': '₹',
      'Europe': '€',
      'Portugal': '€',
      'Cyprus': '€',
      'Malta': '€',
      'Latvia': '€',
      'Canada': 'CAD',
      'Australia': 'AUD',
    };
    return currencyMap[country] || '$';
  };

  // Fetch properties from API on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getAll();
        if (response && response.properties && Array.isArray(response.properties)) {
          // Map backend data to match the expected format
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          const backendUrl = API_URL.replace('/api', '');

          const mappedProperties = response.properties.map(property => {
            // Construct image URL properly
            let imageUrl = '/images/listings/listing-1.jpg'; // fallback
            if (property.images && property.images.length > 0) {
              const img = property.images[0];
              imageUrl = img.startsWith('http') ? img : `${backendUrl}${img}`;
            }

            const currency = getCurrency(property.country);
            return {
              id: property._id,
              title: property.title,
              bed: property.bedrooms || 0,
              bath: property.bathrooms || 0,
              sqft: property.sizeInFt || 0,
              price: `${currency} ${property.price || 0}`,
              yearBuilding: property.yearBuilt || new Date().getFullYear(),
              forRent: property.propertyAdType === 'rent',
              city: property.city || 'Unknown',
              country: property.country || 'Unknown',
              location: `${property.city}, ${property.country}` || 'Unknown',
              propertyType: property.propertyType || 'House',
              image: imageUrl,
              features: property.amenities || [],
            };
          });
          setListings(mappedProperties);
        } else {
          console.error('No properties data returned from API');
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * 6, pageNumber * 6)
    );
    setPageContentTrac([
      (pageNumber - 1) * 6 + 1,
      pageNumber * 6,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  const [listingStatus, setListingStatus] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]);
  const [yearBuild, setyearBuild] = useState([]);
  const [categories, setCategories] = useState([]);

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 100000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");
    document.querySelectorAll(".filterInput").forEach(function (element) {
      element.value = null;
    });

    document.querySelectorAll(".filterSelect").forEach(function (element) {
      element.value = "All Cities";
    });
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handlelistingStatus = (elm) => {
    setListingStatus((pre) => (pre == elm ? "All" : elm));
  };

  const handlepropertyTypes = (elm) => {
    if (elm == "All") {
      setPropertyTypes([]);
    } else {
      setPropertyTypes((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
      );
    }
  };
  const handlepriceRange = (elm) => {
    setPriceRange(elm);
  };
  const handlebedrooms = (elm) => {
    setBedrooms(elm);
  };
  const handlebathroms = (elm) => {
    setBathroms(elm);
  };
  const handlelocation = (elm) => {
    console.log(elm);
    setLocation(elm);
  };
  const handlesquirefeet = (elm) => {
    setSquirefeet(elm);
  };
  const handleyearBuild = (elm) => {
    setyearBuild(elm);
  };
  const handlecategories = (elm) => {
    if (elm == "All") {
      setCategories([]);
    } else {
      setCategories((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el != elm)] : [...pre, elm]
      );
    }
  };
  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    priceRange,
    listingStatus,
    propertyTypes,
    resetFilter,

    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    setPropertyTypes,
    setSearchQuery,
  };

  useEffect(() => {
    // Currency to country mapping
    const currencyCountryMap = {
      'AED': ['UAE', 'United Arab Emirates'],
      'USD': ['USA', 'United States', 'US'],
      'EUR': ['Portugal', 'Cyprus', 'Malta', 'Latvia', 'Europe'],
      'CAD': ['Canada'],
      'AUD': ['Australia'],
      'GBP': ['UK', 'United Kingdom'],
      'INR': ['India'],
    };

    // Filter by currency first
    let currencyFilteredListings = listings;
    if (selectedCurrency !== 'ALL') {
      const allowedCountries = currencyCountryMap[selectedCurrency] || [];
      currencyFilteredListings = listings.filter(elm =>
        allowedCountries.some(country =>
          elm.country?.toLowerCase() === country.toLowerCase()
        )
      );
    }

    const refItems = currencyFilteredListings.filter((elm) => {
      if (listingStatus == "All") {
        return true;
      } else if (listingStatus == "Buy") {
        return !elm.forRent;
      } else if (listingStatus == "Rent") {
        return elm.forRent;
      }
    });

    let filteredArrays = [];

    if (propertyTypes.length > 0) {
      const filtered = refItems.filter((elm) =>
        propertyTypes.includes(elm.propertyType)
      );
      filteredArrays = [...filteredArrays, filtered];
    }
    filteredArrays = [
      ...filteredArrays,
      refItems.filter((el) => el.bed >= bedrooms),
    ];
    filteredArrays = [
      ...filteredArrays,
      refItems.filter((el) => el.bath >= bathroms),
    ];
    filteredArrays = [
      ...filteredArrays,
      refItems.filter(
        (el) =>
          el.city
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase()) ||
          el.location
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase()) ||
          el.title
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase()) ||
          el.features
            .join(" ")
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase())
      ),
    ];

    filteredArrays = [
      ...filteredArrays,
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) =>
            categories.every((elem) => elm.features.includes(elem))
          ),
    ];

    if (location != "All Cities") {
      filteredArrays = [
        ...filteredArrays,
        refItems.filter((el) => el.city == location),
      ];
    }

    if (priceRange.length > 0) {
      const filtered = refItems.filter((elm) => {
        // Extract numeric value from price string (works with any currency)
        const priceMatch = elm.price.match(/[\d,]+/);
        if (!priceMatch) return false;
        const numericPrice = Number(priceMatch[0].replace(/,/g, ''));
        return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
      });
      filteredArrays = [...filteredArrays, filtered];
    }
    if (squirefeet.length > 0 && squirefeet[1]) {
      const filtered = refItems.filter(
        (elm) => elm.sqft >= squirefeet[0] && elm.sqft <= squirefeet[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }
    if (yearBuild.length > 0) {
      const filtered = refItems.filter(
        (elm) =>
          elm.yearBuilding >= yearBuild[0] && elm.yearBuilding <= yearBuild[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    const commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    setFilteredData(commonItems);
  }, [
    listings,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    searchQuery,
    selectedCurrency,
  ]);

  useEffect(() => {
    setPageNumber(1);
    if (currentSortingOption == "Newest") {
      const sorted = [...filteredData].sort(
        (a, b) => a.yearBuilding - b.yearBuilding
      );
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() == "Price Low") {
      const sorted = [...filteredData].sort(
        (a, b) =>
          a.price.split("$")[1].split(",").join("") -
          b.price.split("$")[1].split(",").join("")
      );
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() == "Price High") {
      const sorted = [...filteredData].sort(
        (a, b) =>
          b.price.split("$")[1].split(",").join("") -
          a.price.split("$")[1].split(",").join("")
      );
      setSortedFilteredData(sorted);
    } else {
      setSortedFilteredData(filteredData);
    }
  }, [filteredData, currentSortingOption]);
  return (
    <>
      <section className="pt0 pb90 bgc-f7">
        <div className="container">
          <div className="row gx-xl-5">
            <div className="col-lg-4 d-none d-lg-block">
              <ListingSidebar filterFunctions={filterFunctions} />
            </div>
            {/* End .col-lg-4 */}

            {/* start mobile filter sidebar */}
            <div
              className="offcanvas offcanvas-start p-0"
              tabIndex="-1"
              id="listingSidebarFilter"
              aria-labelledby="listingSidebarFilterLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="listingSidebarFilterLabel">
                  Listing Filter
                </h5>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body p-0">
                <ListingSidebar filterFunctions={filterFunctions} />
              </div>
            </div>
            {/* End mobile filter sidebar */}

            <div className="col-lg-8">
              <div className="row align-items-center mb20">
                <TopFilterBar
                  pageContentTrac={pageContentTrac}
                  colstyle={colstyle}
                  setColstyle={setColstyle}
                  setCurrentSortingOption={setCurrentSortingOption}
                />
              </div>
              {/* End TopFilterBar */}

              {loading ? (
                <div className="row mt15">
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading properties...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading properties from database...</p>
                  </div>
                </div>
              ) : listings.length === 0 ? (
                <div className="row mt15">
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">No properties found in the database.</p>
                  </div>
                </div>
              ) : (
                <div className="row mt15">
                  <FeaturedListings colstyle={colstyle} data={pageItems} />
                </div>
              )}
              {/* End .row */}

              <div className="row">
                <PaginationTwo
                  pageCapacity={6}
                  data={sortedFilteredData}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
              </div>
              {/* End .row */}
            </div>
            {/* End .col-lg-8 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
    </>
  );
}
