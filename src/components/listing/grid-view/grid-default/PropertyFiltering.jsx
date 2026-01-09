"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ListingSidebar from "../../sidebar";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeatuerdListings";
import { propertiesAPI } from "@/services/api";
import PaginationTwo from "../../PaginationTwo";

export default function PropertyFiltering() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [filteredData, setFilteredData] = useState([]);
  const [apiProperties, setApiProperties] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");

  const [sortedFilteredData, setSortedFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const [colstyle, setColstyle] = useState(false);
  const [pageItems, setPageItems] = useState([]);

  const [pageContentTrac, setPageContentTrac] = useState([]);

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * 8, pageNumber * 8)
    );
    setPageContentTrac([
      (pageNumber - 1) * 8 + 1,
      pageNumber * 8,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  const [listingStatus, setListingStatus] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]); // Increased max price to $10M
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]);
  const [yearBuild, setyearBuild] = useState([]);

  // Initialize categories from URL parameter
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryFromUrl = params.get('category');
      if (categoryFromUrl) {
        // Capitalize first letter to match category format in database
        const formattedCategory = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
        console.log('🔗 Initialized categories from URL:', [formattedCategory]);
        return [formattedCategory];
      }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Update categories when URL parameter changes (for navigation between pages)
  useEffect(() => {
    if (categoryParam) {
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      console.log('🔄 URL parameter changed, updating categories to:', [formattedCategory]);
      setCategories([formattedCategory]);
    } else {
      // If no category in URL, clear the filter
      console.log('🔄 URL has no category parameter, clearing categories');
      setCategories([]);
    }
  }, [categoryParam]);

  // Fetch properties from API
  useEffect(() => {
    console.log('🔄 Fetch useEffect triggered. Categories:', categories);
    const fetchProperties = async () => {
      try {
        setIsLoadingApi(true);
        const filters = {};

        // Add category filter if categories are selected
        if (categories.length > 0) {
          filters.category = categories[0]; // Send first selected category
          console.log('📊 Fetching with category filter:', filters.category);
        } else {
          console.log('📊 Fetching all properties (no category filter)');
        }

        const response = await propertiesAPI.getAll(filters);

        if (response.properties && Array.isArray(response.properties)) {
          // Convert API properties to listings format
          const convertedProperties = response.properties.map((prop) => {
            // Handle image data - construct full backend URL for uploaded images
            let imageUrl = "/images/listings/list-1.jpg"; // Default fallback

            if (prop.images && prop.images.length > 0 && prop.images[0]) {
              const firstImage = prop.images[0];
              // If it starts with 'http', it's already a full URL
              if (firstImage.startsWith('http')) {
                imageUrl = firstImage;
              } else if (firstImage.startsWith('/uploads')) {
                // Construct full URL for uploaded images
                const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://homez-q5lh.onrender.com';
                imageUrl = `${backendUrl}${firstImage}`;
              } else if (firstImage.startsWith('/images')) {
                // Local static images
                imageUrl = firstImage;
              }
              console.log('🖼️ Image for', prop.title, ':', imageUrl);
            }

            return {
              id: prop._id,
              title: prop.title,
              price: `$${prop.price}`,
              location: `${prop.city}, ${prop.country}`,
              city: prop.city,
              bed: prop.bedrooms || 0,
              bath: prop.bathrooms || 0,
              sqft: prop.sizeInFt || 0,
              yearBuilding: prop.yearBuilt || new Date().getFullYear(),
              image: imageUrl,
              features: Array.isArray(prop.amenities) ? prop.amenities : [],
              category: Array.isArray(prop.category) ? prop.category : [],
              propertyType: prop.propertyType || "Rent",
              forRent: prop.propertyType === "Rent",
              approvalStatus: prop.approvalStatus,
            };
          });

          console.log(`✓ API returned ${convertedProperties.length} properties`, { filters, convertedProperties });
          setApiProperties(convertedProperties);
        } else {
          console.warn("API response format unexpected:", response);
          setApiProperties([]);
        }
      } catch (error) {
        console.error("Failed to fetch properties from API:", error);
        console.warn("⚠ Using mock data fallback");
        // Fallback to mock data if API fails
        setApiProperties([]);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchProperties();
  }, [categories]); // Re-fetch when category checkboxes change

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 10000000]);
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
  };

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
    console.log('🎯 handlecategories called with:', elm, 'Current categories:', categories);
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
    // Only use API properties - no mock data fallback
    const dataSource = apiProperties;

    if (apiProperties.length === 0 && !isLoadingApi) {
      console.warn(`⚠️ No properties found in database for the current filter`);
    } else if (apiProperties.length > 0) {
      console.log(`✓ Displaying ${apiProperties.length} real properties from database`);
    }

    const refItems = dataSource.filter((elm) => {
      if (listingStatus == "All") {
        return true;
      } else if (listingStatus == "Buy") {
        return !elm.forRent;
      } else if (listingStatus == "Rent") {
        return elm.forRent;
      }
    });

    console.log('🔍 After listing status filter:', refItems.length, 'properties');
    console.log('🔍 Current filter states:', {
      propertyTypes,
      bedrooms,
      bathroms,
      location,
      categories,
      searchQuery,
      priceRange,
      squirefeet,
      yearBuild
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
            categories.some((elem) =>
              elm.category && elm.category.some((cat) =>
                cat.toLowerCase() === elem.toLowerCase()
              )
            )
          ),
    ];

    if (location != "All Cities") {
      filteredArrays = [
        ...filteredArrays,
        refItems.filter((el) => el.city == location),
      ];
    }

    if (priceRange.length > 0) {
      const filtered = refItems.filter(
        (elm) =>
          Number(elm.price.split("$")[1].split(",").join("")) >=
            priceRange[0] &&
          Number(elm.price.split("$")[1].split(",").join("")) <= priceRange[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    if (squirefeet.length > 0 && squirefeet[1]) {
      console.log(squirefeet);
      const filtered = refItems.filter(
        (elm) =>
          elm.sqft >= Number(squirefeet[0]) && elm.sqft <= Number(squirefeet[1])
      );
      filteredArrays = [...filteredArrays, filtered];
    }
    if (yearBuild.length > 0) {
      const filtered = refItems.filter(
        (elm) =>
          elm.yearBuilding >= Number(yearBuild[0]) &&
          elm.yearBuilding <= Number(yearBuild[1])
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    const commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    console.log('🔍 Final filtered data:', commonItems.length, 'properties');
    console.log('🔍 filteredArrays lengths:', filteredArrays.map(arr => arr.length));
    console.log('🔍 Final properties:', commonItems.map(p => ({ title: p.title, category: p.category })));

    setFilteredData(commonItems);
  }, [
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
    apiProperties,
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

            <div className="row mt15">
              <FeaturedListings colstyle={colstyle} data={pageItems} />
            </div>
            {/* End .row */}

            <div className="row">
              <PaginationTwo
                pageCapacity={8}
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
  );
}
