'use client'


import { propertiesAPI } from "@/services/api";
import React, { useState,useEffect } from 'react'
import ListingSidebar from "../../sidebar";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeatuerdListings";
import Pagination from "../../Pagination";
import PaginationTwo from "../../PaginationTwo";
import ListingMap1 from "../ListingMap1";
import { useSearchParams } from 'next/navigation';
import { getCountryBySlug } from "@/data/countryDetails";

export default function PropertyFilteringMapFour() {
    const searchParams = useSearchParams();
    const countryParam = searchParams.get('country');

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState('ALL');
    const [selectedCountry, setSelectedCountry] = useState(countryParam || 'All');
    const [countryDetails, setCountryDetails] = useState(null);
    const [showCountryDetails, setShowCountryDetails] = useState(false);

    const [currentSortingOption, setCurrentSortingOption] = useState('Newest')

    const [sortedFilteredData, setSortedFilteredData] = useState([]);

        const [pageNumber, setPageNumber] = useState(1)
    const [colstyle, setColstyle] = useState(false)
    const [pageItems, setPageItems] = useState([])
    const [pageContentTrac, setPageContentTrac] = useState([])

    // Listen for currency changes
    useEffect(() => {
      const savedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
      setSelectedCurrency(savedCurrency);

      const handleCurrencyChange = (e) => {
        setSelectedCurrency(e.detail.currency);
      };

      window.addEventListener('currencyChanged', handleCurrencyChange);
      return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
    }, []);

    // Load country details when country parameter changes
    useEffect(() => {
      if (countryParam && countryParam !== 'All') {
        const details = getCountryBySlug(countryParam.toLowerCase());
        if (details) {
          setCountryDetails(details);
          setShowCountryDetails(true);
        }
      } else {
        setCountryDetails(null);
        setShowCountryDetails(false);
      }
    }, [countryParam]);

    // Get Unsplash image for country
    const getCountryHeroImage = (countryName) => {
      const imageMap = {
        'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80', // Sydney Opera House
        'UAE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80', // Dubai skyline
        'USA': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80', // New York City
        'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80', // London
        'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&q=80', // Toronto
        'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
        'United Arab Emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80',
        'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1920&q=80',
      };
      return imageMap[countryName] || `https://source.unsplash.com/1920x1080/?${countryName},city,architecture`;
    };

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
                latitude: property.latitude,
                longitude: property.longitude,
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
      setPageItems(sortedFilteredData
        .slice((pageNumber - 1) * 4, pageNumber * 4))
        setPageContentTrac([((pageNumber - 1) * 4) + 1 ,pageNumber * 4,sortedFilteredData.length])
    }, [pageNumber,sortedFilteredData])

    const [listingStatus, setListingStatus] = useState('All')
    const [propertyTypes, setPropertyTypes] = useState([])
    const [priceRange, setPriceRange] = useState([0,100000])
    const [bedrooms, setBedrooms] = useState(0)
    const [bathroms, setBathroms] = useState(0)
    const [location, setLocation] = useState('All')
     const [squirefeet, setSquirefeet] = useState([])
    const [yearBuild, setyearBuild] = useState([])
    const [categories, setCategories] = useState([])

    const resetFilter = ()=>{
      setListingStatus('All')
      setPropertyTypes([])
      setPriceRange([0,100000])
      setBedrooms(0)
      setBathroms(0)
      setLocation('All')
      setSquirefeet([])
      setyearBuild([0,2050])
      setCategories([])
      setCurrentSortingOption('Newest')
     document.querySelectorAll(".filterInput").forEach(function(element) {
      element.value = null;
  });

     document.querySelectorAll(".filterSelect").forEach(function(element) {
      element.value = 'All';
  });
  


    }
    const [searchQuery, setSearchQuery] = useState('')

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
    setPropertyTypes,
    setSearchQuery
  }



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
          filteredArrays = [...filteredArrays,refItems.filter((el=>el.bed >=bedrooms)) ];
          filteredArrays = [...filteredArrays,refItems.filter((el=>el.bath >=bathroms)) ];
          filteredArrays = [...filteredArrays,refItems.filter((el=>el.city.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||  el.location.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||  el.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())  ||  el.features.join(' ').toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))) ];
         
    
          filteredArrays = [...filteredArrays,!categories.length ? [...refItems] : refItems.filter((elm)=>categories.every(elem=>elm.features.includes(elem))) ];
  
          // Filter by country (location dropdown now shows countries)
          if (location != 'All Countries' && location != 'All') {
            filteredArrays = [...filteredArrays,refItems.filter((el=>el.country == location)) ];
          } else {
            filteredArrays = [...filteredArrays,refItems]; // Include all items when "All" is selected
          }

          if (selectedCountry != 'All') {
            filteredArrays = [...filteredArrays,refItems.filter((el=>el.country == selectedCountry)) ];
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
        selectedCountry

    ])

    useEffect(() => {
      setPageNumber(1)
      if (currentSortingOption == 'Newest') {
        const sorted = [...filteredData].sort((a,b)=>a.yearBuilding - b.yearBuilding)
        setSortedFilteredData(sorted)
       
        
      } 
      else if (currentSortingOption.trim() == 'Price Low') {
        const sorted = [...filteredData].sort((a,b)=>{
          const priceA = Number(a.price.replace(/[^0-9.]/g, ''));
          const priceB = Number(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        })
        setSortedFilteredData(sorted)


      }
      else if (currentSortingOption.trim() == 'Price High') {
        const sorted = [...filteredData].sort((a,b)=>{
          const priceA = Number(a.price.replace(/[^0-9.]/g, ''));
          const priceB = Number(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        })
        setSortedFilteredData(sorted)


      } 
    
      else {
        setSortedFilteredData(filteredData)
    
        
      }

      
    }, [filteredData,currentSortingOption,])
  return (
    <>

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
      {/* End  filter sidebar */}

      {/* Property Filtering */}
      <section className="p-0 bgc-f7">
        <div className="container-fluid">
          {/* Premium Country Hero Section */}
          {showCountryDetails && countryDetails && (
            <>
              <style jsx>{`
                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes float {
                  0%, 100% {
                    transform: translateY(0);
                  }
                  50% {
                    transform: translateY(-10px);
                  }
                }

                .country-hero-section {
                  position: relative;
                  min-height: 650px;
                  background: linear-gradient(135deg, rgba(31, 41, 55, 0.75) 0%, rgba(17, 24, 39, 0.85) 100%),
                              url('${getCountryHeroImage(countryDetails.name)}');
                  background-size: cover;
                  background-position: center;
                  background-attachment: fixed;
                  display: flex;
                  align-items: center;
                  overflow: hidden;
                  padding: 60px 0;
                }

                .country-hero-section::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: radial-gradient(circle at 30% 50%, rgba(235, 103, 83, 0.15) 0%, transparent 60%);
                  pointer-events: none;
                }

                .hero-content-wrapper {
                  animation: fadeInUp 0.8s ease-out;
                }

                .premium-card {
                  background: rgba(255, 255, 255, 0.92);
                  padding: 40px 45px;
                  border-radius: 16px;
                  backdrop-filter: blur(25px) saturate(180%);
                  -webkit-backdrop-filter: blur(25px) saturate(180%);
                  box-shadow: 0 25px 70px rgba(0,0,0,0.2),
                              0 10px 25px rgba(0,0,0,0.12);
                  border: 1px solid rgba(255,255,255,0.4);
                  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  max-width: 600px;
                  margin: 0 auto;
                }

                .premium-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 40px 100px rgba(0,0,0,0.3);
                }

                .stat-box {
                  background: #ffffff;
                  padding: 18px 15px;
                  border-radius: 10px;
                  border: 2px solid #f3f4f6;
                  transition: all 0.3s ease;
                  position: relative;
                  overflow: hidden;
                }

                .stat-box::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 3px;
                  background: linear-gradient(90deg, #eb6753 0%, #dc3c28 100%);
                  transform: scaleX(0);
                  transition: transform 0.3s ease;
                }

                .stat-box:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 10px 25px rgba(235, 103, 83, 0.15);
                }

                .stat-box:hover::before {
                  transform: scaleX(1);
                }

                .category-badge {
                  background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
                  color: white;
                  padding: 10px 20px;
                  border-radius: 25px;
                  font-size: 13px;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 15px rgba(235, 103, 83, 0.3);
                  border: 1px solid rgba(255,255,255,0.2);
                }

                .category-badge:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(235, 103, 83, 0.4);
                }

                .premium-btn {
                  padding: 16px 35px;
                  font-size: 15px;
                  font-weight: 600;
                  border-radius: 50px;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  position: relative;
                  overflow: hidden;
                }

                .premium-btn::before {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  width: 0;
                  height: 0;
                  border-radius: 50%;
                  background: rgba(255,255,255,0.3);
                  transform: translate(-50%, -50%);
                  transition: width 0.6s, height 0.6s;
                }

                .premium-btn:hover::before {
                  width: 300px;
                  height: 300px;
                }

                .premium-btn-primary {
                  background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
                  border: none;
                  color: white;
                  box-shadow: 0 8px 25px rgba(235, 103, 83, 0.35);
                }

                .premium-btn-primary:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 12px 35px rgba(235, 103, 83, 0.45);
                }

                .premium-btn-secondary {
                  background: white;
                  border: 2px solid #eb6753;
                  color: #eb6753;
                  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }

                .premium-btn-secondary:hover {
                  background: #eb6753;
                  color: white;
                  transform: translateY(-3px);
                  box-shadow: 0 12px 35px rgba(235, 103, 83, 0.35);
                }

                .scroll-indicator {
                  position: absolute;
                  bottom: 30px;
                  left: 50%;
                  transform: translateX(-50%);
                  animation: float 2s ease-in-out infinite;
                  cursor: pointer;
                  z-index: 10;
                }

                .scroll-indicator-icon {
                  width: 30px;
                  height: 50px;
                  border: 2px solid white;
                  border-radius: 25px;
                  position: relative;
                  opacity: 0.8;
                  transition: opacity 0.3s;
                }

                .scroll-indicator-icon:hover {
                  opacity: 1;
                }

                .scroll-indicator-icon::before {
                  content: '';
                  position: absolute;
                  top: 8px;
                  left: 50%;
                  width: 4px;
                  height: 8px;
                  background: white;
                  border-radius: 4px;
                  transform: translateX(-50%);
                  animation: scrollDown 2s ease-in-out infinite;
                }

                @keyframes scrollDown {
                  0%, 100% {
                    top: 8px;
                    opacity: 0;
                  }
                  50% {
                    top: 16px;
                    opacity: 1;
                  }
                }

                .highlight-badge {
                  display: inline-block;
                  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
                  color: #1f2937;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 11px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 15px;
                  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
                }

                .city-pill {
                  display: inline-block;
                  background: rgba(235, 103, 83, 0.08);
                  color: #eb6753;
                  padding: 6px 14px;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: 600;
                  margin: 4px;
                  transition: all 0.3s ease;
                  border: 1px solid rgba(235, 103, 83, 0.15);
                }

                .city-pill:hover {
                  background: #eb6753;
                  color: white;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(235, 103, 83, 0.3);
                }

                @media (max-width: 1200px) {
                  .premium-card {
                    max-width: 550px;
                  }
                }

                @media (max-width: 992px) {
                  .country-hero-section {
                    min-height: 550px;
                    background-attachment: scroll;
                  }
                  .premium-card {
                    padding: 35px;
                    max-width: 100%;
                    margin: 0;
                  }
                }

                @media (max-width: 576px) {
                  .premium-card {
                    padding: 25px 20px;
                  }
                }
              `}</style>

              <div className="country-hero-section">
                <div className="container">
                  <div className="row align-items-center" style={{ minHeight: '650px' }}>
                    <div className="col-lg-7 col-xl-6">
                      <div className="hero-content-wrapper" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                        <div className="premium-card">
                          <div className="highlight-badge">
                            <i className="fas fa-star me-1"></i> Premium Investment Destination
                          </div>

                          <h1 style={{
                            fontSize: '42px',
                            fontWeight: '800',
                            color: '#1f2937',
                            lineHeight: '1.3',
                            marginBottom: '15px',
                            letterSpacing: '-0.5px'
                          }}>
                            {countryDetails.name}
                          </h1>
                          <h2 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#eb6753',
                            lineHeight: '1.3',
                            marginBottom: '20px',
                            letterSpacing: '-0.3px'
                          }}>
                            Real Estate Market
                          </h2>

                          <p style={{
                            fontSize: '15px',
                            color: '#6b7280',
                            lineHeight: '1.6',
                            marginBottom: '25px',
                            fontWeight: '400'
                          }}>
                            {countryDetails.economy.overview}
                          </p>

                          {/* Statistics Grid */}
                          <div className="row mb25" style={{ gap: '10px 0' }}>
                            <div className="col-6 col-md-3">
                              <div className="stat-box text-center">
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: '#eb6753',
                                  marginBottom: '4px'
                                }}>{countryDetails.currency}</div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Currency</div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <div className="stat-box text-center">
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: '#eb6753',
                                  marginBottom: '4px'
                                }}>{countryDetails.economy.gdpGrowth}</div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GDP Growth</div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <div className="stat-box text-center">
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: '#eb6753',
                                  marginBottom: '4px'
                                }}>{countryDetails.foreignInvestment.approvalRequired ? 'Yes' : 'No'}</div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Approval</div>
                              </div>
                            </div>
                            <div className="col-6 col-md-3">
                              <div className="stat-box text-center">
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: '#eb6753',
                                  marginBottom: '4px'
                                }}>{countryDetails.benefits.length}+</div>
                                <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Benefits</div>
                              </div>
                            </div>
                          </div>

                          {/* Property Categories */}
                          <div className="mb25">
                            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                              Available Property Types
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              <span className="category-badge">
                                <i className="flaticon-home me-1"></i>Residential
                              </span>
                              <span className="category-badge">
                                <i className="flaticon-building me-1"></i>Commercial
                              </span>
                              <span className="category-badge">
                                <i className="flaticon-investment me-1"></i>Investment
                              </span>
                              <span className="category-badge">
                                <i className="flaticon-land me-1"></i>Land
                              </span>
                            </div>
                          </div>

                          {/* Popular Cities */}
                          <div className="mb25">
                            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                              <i className="flaticon-location me-1" style={{ fontSize: '10px' }}></i>Popular Investment Cities
                            </div>
                            <div>
                              {countryDetails.popularCities.slice(0, 6).map((city, index) => (
                                <span key={index} className="city-pill">{city}</span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex gap-3 flex-wrap">
                            <a
                              href={`/country-details/${countryDetails.slug}`}
                              className="premium-btn premium-btn-primary"
                              style={{ textDecoration: 'none' }}
                            >
                              <i className="fas fa-info-circle me-2"></i>
                              Explore Details
                            </a>
                            <button
                              className="premium-btn premium-btn-secondary"
                              onClick={() => {
                                document.querySelector('.half_map_area_content')?.scrollIntoView({
                                  behavior: 'smooth'
                                });
                              }}
                            >
                              <i className="fas fa-building me-2"></i>
                              View Properties
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div
                  className="scroll-indicator"
                  onClick={() => {
                    document.querySelector('.half_map_area_content')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  <div className="scroll-indicator-icon"></div>
                </div>
              </div>
            </>
          )}

          <div className="row" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
            <div className="col-xl-5">
              <div className="half_map_area_content mt30">
                <h4 className="mb-1">Properties for Sale & Rent</h4>

                <div className="row align-items-center mb10">
                  <TopFilterBar  pageContentTrac={pageContentTrac}  colstyle ={colstyle} setColstyle={setColstyle}  setCurrentSortingOption={setCurrentSortingOption} />
                </div>
                {loading ? (
                  <div className="row">
                    <div className="col-12 text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading properties...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading properties from database...</p>
                    </div>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="row">
                    <div className="col-12 text-center py-5">
                      <p className="text-muted">No properties found in the database.</p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <FeaturedListings  colstyle ={colstyle}  data={pageItems}/>
                  </div>
                )}
                {/* End .row */}

                <div className="row text-center">
                <PaginationTwo pageCapacity={4} data={sortedFilteredData} pageNumber={pageNumber} setPageNumber={setPageNumber}/>
          
                </div>
                {/* End .row */}
              </div>
              {/* End .half_map_area_content */}
            </div>
            {/* End col-5 */}

            <div className="col-xl-7 overflow-hidden position-relative">
              <div className="half_map_area">
                <a
                  data-bs-toggle="offcanvas"
                  href="#listingSidebarFilter"
                  role="button"
                  aria-controls="listingSidebarFilter"
                  className="filter-btn-left mobile-filter-btn map-page bgc-dark text-white d-block"
                >
                  <span className="flaticon-settings"></span> Show Filter
                </a>
                <div className=" map-canvas half_style">
                  <ListingMap1 properties={sortedFilteredData}/>
                </div>
              </div>
            </div>
            {/* End col-7 */}
          </div>
          {/* End TopFilterBar */}
        </div>
        {/* End .container */}
      </section>
    </>
  )
}
