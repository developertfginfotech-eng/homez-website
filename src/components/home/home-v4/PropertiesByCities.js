"use client";

import { getAllProperties } from "@/helpers/propertyApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const PropertiesByCities = () => {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  // Map country names to slugs
  const countrySlugMap = {
    'Australia': 'australia',
    'UAE': 'uae',
    'United Arab Emirates': 'uae',
    'USA': 'usa',
    'United States': 'usa',
    'US': 'usa',
    'UK': 'uk',
    'United Kingdom': 'uk',
    'Canada': 'canada',
    'India': 'india',
    'Germany': 'germany',
    'France': 'france',
    'Portugal': 'portugal',
    'Cyprus': 'cyprus',
    'Malta': 'malta',
  };

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

  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        const properties = await getAllProperties();
        const approvedProps = properties.filter(p => p.approvalStatus === 'approved');

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

        // Filter by currency if not ALL
        let filteredProps = approvedProps;
        if (selectedCurrency !== 'ALL') {
          const allowedCountries = currencyCountryMap[selectedCurrency] || [];
          filteredProps = approvedProps.filter(property =>
            allowedCountries.some(country =>
              property.country?.toLowerCase() === country.toLowerCase()
            )
          );
        }

        // Country landmark images mapping
        const countryLandmarkImages = {
          'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=400&fit=crop', // Sydney Opera House
          'UAE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop', // Dubai Burj Khalifa
          'United Arab Emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop',
          'USA': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=400&fit=crop', // New York City
          'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=400&fit=crop',
          'US': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=400&fit=crop',
          'UK': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop', // London
          'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop',
          'Portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=400&fit=crop', // Lisbon
          'Cyprus': 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=400&fit=crop',
          'Malta': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
          'Canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&h=400&fit=crop', // Toronto
          'India': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop', // Taj Mahal
        };

        // Group properties by country
        const countryMap = {};
        filteredProps.forEach(property => {
          const country = property.country || 'Unknown';

          if (!countryMap[country]) {
            countryMap[country] = {
              name: country,
              propertyCount: 0,
              image: countryLandmarkImages[country] || '/images/listings/city-1.png'
            };
          }
          countryMap[country].propertyCount++;
        });

        // Convert to array and sort alphabetically by country name
        const countriesArray = Object.values(countryMap)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 10); // Top 10 countries

        setCountriesData(countriesArray);
      } catch (error) {
        console.error('Error fetching countries data:', error);
        setCountriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesData();
  }, [selectedCurrency]);

  if (loading) {
    return <div className="text-center py-4">Loading countries...</div>;
  }

  if (countriesData.length === 0) {
    return <div className="text-center py-4">No countries available</div>;
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation]}
        navigation={{
          nextEl: ".property-by-city-next__active",
          prevEl: ".property-by-city-prev__active",
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
          1200: {
            slidesPerView: 6,
          },
        }}
      >
        {countriesData.map((country, index) => {
          const countrySlug = countrySlugMap[country.name] || country.name.toLowerCase();
          const countryUrl = `/country-details/${countrySlug}`;

          return (
            <SwiperSlide key={`${country.name}-${index}`}>
              <Link href={countryUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="item" style={{ cursor: 'pointer' }}>
                  <div className="feature-style3 text-center" style={{ transition: 'transform 0.3s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                    <div className="feature-img rounded-circle" style={{ width: '176px', height: '176px', margin: '0 auto', overflow: 'hidden' }}>
                      <Image
                        width={176}
                        height={176}
                        className="cover"
                        style={{ objectFit: 'cover', width: '176px', height: '176px' }}
                        src={country.image}
                        alt={country.name}
                        onError={(e) => {
                          e.target.src = '/images/listings/city-1.png';
                        }}
                      />
                    </div>
                    <div className="feature-content pt25">
                      <div className="top-area">
                        <h6 className="title mb-1" style={{ color: '#eb6753', fontSize: '20px', fontWeight: '700' }}>
                          {country.name}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="property-by-city-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        {/* End prev */}

        <button className="property-by-city-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default PropertiesByCities;
