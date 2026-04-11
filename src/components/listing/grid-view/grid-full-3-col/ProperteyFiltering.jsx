
'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ListingSidebar from '../../sidebar'
import AdvanceFilterModal from '@/components/common/advance-filter-two'
import TopFilterBar from './TopFilterBar'
import FeaturedListings from './FeatuerdListings'
import Pagination from '../../Pagination'
import PaginationTwo from "../../PaginationTwo";
import { getAllProperties } from "@/helpers/propertyApi";

export default function ProperteyFiltering() {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get("search") || searchParams.get("city") || "";
  const urlType = searchParams.get("type") || "All";
  const urlBeds = parseInt(searchParams.get("beds") || "0", 10);
  const urlMaxPrice = parseInt(searchParams.get("maxPrice") || "0", 10);
  const urlPropertyType = searchParams.get("propertyType") || "";
  const urlGym = searchParams.get("gym") === "true";
  const urlPool = searchParams.get("pool") === "true";
  const urlParking = searchParams.get("parking") === "true";
  const urlGarden = searchParams.get("garden") === "true";
  const urlInvest = searchParams.get("invest") === "true";

  const [filteredData, setFilteredData] = useState([]);
  const [apiProperties, setApiProperties] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');
  const [currentSortingOption, setCurrentSortingOption] = useState(urlInvest ? 'Price Low' : 'Newest')
  const [sortedFilteredData, setSortedFilteredData] = useState([]);


        const [pageNumber, setPageNumber] = useState(1)
    const [colstyle, setColstyle] = useState(false)
    const [pageItems, setPageItems] = useState([])
    const [pageContentTrac, setPageContentTrac] = useState([])

    useEffect(() => {
      setPageItems(sortedFilteredData
        .slice((pageNumber - 1) * 9, pageNumber * 9))
        setPageContentTrac([((pageNumber - 1) * 9) + 1 ,pageNumber * 9,sortedFilteredData.length])
    }, [pageNumber,sortedFilteredData])



    const [listingStatus, setListingStatus] = useState(urlType === "Rent" ? "Rent" : urlType === "Sale" ? "Buy" : "All")
    const [propertyTypes, setPropertyTypes] = useState(urlPropertyType ? [urlPropertyType] : [])
    const [priceRange, setPriceRange] = useState(urlMaxPrice > 0 ? [0, urlMaxPrice] : [0,100000])
    const [bedrooms, setBedrooms] = useState(urlBeds || 0)
    const [bathroms, setBathroms] = useState(0)
    const [location, setLocation] = useState('All Cities')
     const [squirefeet, setSquirefeet] = useState([])
    const [yearBuild, setyearBuild] = useState([])
    const [categories, setCategories] = useState([])

    // Update listing status when URL type parameter changes
    useEffect(() => {
      if (urlType === "Rent") {
        setListingStatus("Rent");
      } else if (urlType === "Sale") {
        setListingStatus("Buy");
      } else {
        // "All", "Sold", or no type — show everything
        setListingStatus("All");
      }
    }, [urlType]);

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

    const resetFilter = ()=>{
      setListingStatus('All')
      setPropertyTypes([])
      setPriceRange([0,100000])
      setBedrooms(0)
      setBathroms(0)
      setLocation('All Cities')
      setSquirefeet([])
      setyearBuild([0,2050])
      setCategories([])
      setCurrentSortingOption('Newest')
     document.querySelectorAll(".filterInput").forEach(function(element) {
      element.value = null;
  });

     document.querySelectorAll(".filterSelect").forEach(function(element) {
      element.value = 'All Cities';
  });
  


    }

    const handlelistingStatus =(elm)=>{
      setListingStatus(pre => pre == elm ? 'All':elm)


    }

    
    
    const handlepropertyTypes =(elm)=>{


      if (elm == 'All') {
        setPropertyTypes([])
        
      } else {
        setPropertyTypes(pre=>pre.includes(elm) ? [...pre.filter((el)=>el!=elm)] : [...pre,elm])
      }
    

    }
    const handlepriceRange =(elm)=>{
      setPriceRange(elm)

    }
    const handlebedrooms =(elm)=>{
      setBedrooms(elm)
    }
    const handlebathroms =(elm)=>{
      setBathroms(elm)
    }
    const handlelocation =(elm)=>{
      console.log(elm)
      setLocation(elm)
    }
    const handlesquirefeet =(elm)=>{
      setSquirefeet(elm)
    }
    const handleyearBuild =(elm)=>{
      setyearBuild(elm)
    }
    const handlecategories =(elm)=>{
      if (elm == 'All') {
        setCategories([])
        
      } else {
        setCategories(pre=>pre.includes(elm) ? [...pre.filter((el)=>el!=elm)] : [...pre,elm])
      }

    }
   const filterFunctions={
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
    setPropertyTypes
  }

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoadingApi(true);
        const data = await getAllProperties();

        if (data && Array.isArray(data)) {
          // Convert API properties to listings format
          const convertedProperties = data
            .filter(p => p.approvalStatus === 'approved')
            .map((prop) => {
              const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
              const backendUrl = API_URL.replace('/api', '');

              let imageUrl = "/images/listings/list-1.jpg";
              if (prop.images && prop.images.length > 0 && prop.images[0]) {
                const firstImage = prop.images[0];
                imageUrl = firstImage.startsWith('http') ? firstImage : `${backendUrl}${firstImage}`;
              }

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

              const currency = getCurrency(prop.country);

              return {
                id: prop._id,
                title: prop.title,
                price: `${currency} ${prop.price}`,
                location: `${prop.city}, ${prop.country}`,
                city: prop.city,
                country: prop.country || 'Unknown',
                bed: prop.bedrooms || 0,
                bath: prop.bathrooms || 0,
                sqft: prop.sizeInFt || 0,
                yearBuilding: prop.yearBuilt || new Date().getFullYear(),
                image: imageUrl,
                features: Array.isArray(prop.amenities) ? prop.amenities : [],
                category: Array.isArray(prop.category) ? prop.category : [],
                propertyType: prop.propertyType || "House",
                forRent: prop.propertyAdType === "rent",
              };
            });

          console.log(`✓ API returned ${convertedProperties.length} approved properties`);
          setApiProperties(convertedProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties from API:", error);
        setApiProperties([]);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchProperties();
  }, []);

    useEffect(() => {
        // First filter by currency
        const currencyCountryMap = {
          'AED': ['UAE', 'United Arab Emirates'],
          'USD': ['USA', 'United States', 'US'],
          'EUR': ['Portugal', 'Cyprus', 'Malta', 'Latvia', 'Europe'],
          'CAD': ['Canada'],
          'AUD': ['Australia'],
          'GBP': ['UK', 'United Kingdom'],
          'INR': ['India'],
        };

        let refItems = apiProperties;
        if (selectedCurrency !== 'ALL') {
          const allowedCountries = currencyCountryMap[selectedCurrency] || [];
          refItems = apiProperties.filter(elm =>
            allowedCountries.some(country =>
              elm.country?.toLowerCase() === country.toLowerCase()
            )
          );
        }

        // Then filter by URL search parameter — supports comma-separated multi-location (OR logic)
        if (urlSearchQuery) {
          const searchTerms = urlSearchQuery.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
          refItems = refItems.filter((elm) =>
            searchTerms.some((term) => {
              const cityMatch = elm.city && elm.city.toLowerCase().includes(term);
              const countryMatch = elm.country && elm.country.toLowerCase().includes(term);
              const locationMatch = elm.location && elm.location.toLowerCase().includes(term);
              const titleMatch = elm.title && elm.title.toLowerCase().includes(term);
              return cityMatch || countryMatch || locationMatch || titleMatch;
            })
          );
        }

        // Then apply listing status filter
        refItems = refItems.filter((elm) => {
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
            // Normalize both sides: lowercase + remove trailing 's' for singular/plural matching
            const normalize = (s) => (s || "").toLowerCase().replace(/s$/, "");
            const normalizedTypes = propertyTypes.map(normalize);
            const filtered = refItems.filter((elm) =>
              normalizedTypes.includes(normalize(elm.propertyType))
            );
            filteredArrays = [...filteredArrays, filtered];
          }
          filteredArrays = [...filteredArrays,refItems.filter((el=>el.bed >=bedrooms)) ];
          filteredArrays = [...filteredArrays,refItems.filter((el=>el.bath >=bathroms)) ];

          // Amenity filters from URL params
          if (urlGym) filteredArrays = [...filteredArrays, refItems.filter((el) => el.gym === true)];
          if (urlPool) filteredArrays = [...filteredArrays, refItems.filter((el) => el.swimmingPool === true || el.pool === true)];
          if (urlParking) filteredArrays = [...filteredArrays, refItems.filter((el) => el.parking === true)];
          if (urlGarden) filteredArrays = [...filteredArrays, refItems.filter((el) => el.garden === true)];


          filteredArrays = [...filteredArrays,!categories.length ? [...refItems] : refItems.filter((elm)=>categories.every(elem=>elm.features.includes(elem))) ];

          if (location != 'All Cities') {


            filteredArrays = [...filteredArrays,refItems.filter((el=>el.city == location)) ];
          }
         
         
          if (priceRange.length > 0) {
            const filtered = refItems.filter((elm) => {
              const priceMatch = elm.price?.match(/[\d,]+/);
              if (!priceMatch) return false;
              const numericPrice = Number(priceMatch[0].replace(/,/g, ''));
              return numericPrice >= priceRange[0] && numericPrice <= priceRange[1];
            });
            filteredArrays = [...filteredArrays, filtered];
          }
          if (squirefeet.length > 0 && squirefeet[1]) {
            const filtered = refItems.filter(
              (elm) =>
              elm.sqft >= squirefeet[0] &&
             elm.sqft <= squirefeet[1],
            );
            filteredArrays = [...filteredArrays, filtered];
          }
          if (yearBuild.length > 0) {
            const filtered = refItems.filter(
              (elm) =>
                elm.yearBuilding >= yearBuild[0] &&
                 elm.yearBuilding <= yearBuild[1]
            );
            filteredArrays = [...filteredArrays, filtered];
          }
          

 
         
      
          const commonItems = refItems.filter((item) =>
            filteredArrays.every((array) => array.includes(item))
          );


          setFilteredData(commonItems);



    }, [
        selectedCurrency,
        urlSearchQuery,
        listingStatus,
        propertyTypes,
        priceRange,
        bedrooms,
        bathroms,
        location,
        squirefeet,
        yearBuild,
        categories,
        apiProperties
    ])

    useEffect(() => {
      setPageNumber(1)
      if (currentSortingOption == 'Newest') {
        const sorted = [...filteredData].sort((a,b)=>a.yearBuilding - b.yearBuilding)
        setSortedFilteredData(sorted)
       
        
      } 
      else if (currentSortingOption.trim() == 'Price Low') {
        const sorted = [...filteredData].sort((a,b)=>{
          const priceA = Number(a.price?.replace(/[^0-9.]/g, '') || 0);
          const priceB = Number(b.price?.replace(/[^0-9.]/g, '') || 0);
          return priceA - priceB;
        })
        setSortedFilteredData(sorted)


      }
      else if (currentSortingOption.trim() == 'Price High') {
        const sorted = [...filteredData].sort((a,b)=>{
          const priceA = Number(a.price?.replace(/[^0-9.]/g, '') || 0);
          const priceB = Number(b.price?.replace(/[^0-9.]/g, '') || 0);
          return priceB - priceA;
        })
        setSortedFilteredData(sorted)


      } 
    
      else {
        setSortedFilteredData(filteredData)
    
        
      }

      
    }, [filteredData,currentSortingOption,])
    
  return (
    <section className="pt0 pb90 bgc-f7">
        <div className="container">
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
              <ListingSidebar filterFunctions={filterFunctions}  />
            </div>
          </div>
          {/* End mobile filter sidebar */}

          {/* <!-- Advance Feature Modal Start --> */}
          <div className="advance-feature-modal">
            <div
              className="modal fade"
              id="advanceSeachModal"
              tabIndex={-1}
              aria-labelledby="advanceSeachModalLabel"
              aria-hidden="true"
            >
              <AdvanceFilterModal filterFunctions={filterFunctions} />
            </div>
          </div>
          {/* <!-- Advance Feature Modal End --> */}

          <div className="row">
            <TopFilterBar  pageContentTrac={pageContentTrac}  colstyle ={colstyle} setColstyle={setColstyle}  filterFunctions={filterFunctions} setCurrentSortingOption={setCurrentSortingOption} />
          </div>
          {/* End TopFilterBar */}

          <div className="row">
            {isLoadingApi ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading properties...</span>
                </div>
                <p className="mt-3">Loading properties from database...</p>
              </div>
            ) : pageItems.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p>No properties found. Try adjusting your filters.</p>
              </div>
            ) : (
              <FeaturedListings  colstyle ={colstyle}  data={pageItems} />
            )}
          </div>
          {/* End .row */}

          <div className="row">
          <PaginationTwo pageCapacity={9} data={sortedFilteredData} pageNumber={pageNumber} setPageNumber={setPageNumber}/>
          
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
  )
}
