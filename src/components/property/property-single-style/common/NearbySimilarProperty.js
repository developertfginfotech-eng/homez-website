"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { propertiesAPI } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const NearbySimilarProperty = ({ currentPropertyId }) => {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('ALL');

  useEffect(() => {
    // Load selected currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'ALL';
    setSelectedCurrency(savedCurrency);

    // Listen for currency changes
    const handleCurrencyChange = (e) => {
      setSelectedCurrency(e.detail.currency);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => window.removeEventListener('currencyChanged', handleCurrencyChange);
  }, []);

  useEffect(() => {
    fetchCurrentProperty();
  }, [currentPropertyId]);

  useEffect(() => {
    if (currentProperty) {
      fetchProperties();
    }
  }, [currentProperty, selectedCurrency]);

  const fetchCurrentProperty = async () => {
    if (!currentPropertyId) {
      // Silently wait for property ID (Next.js params loading)
      setLoading(false);
      return;
    }

    try {
      const response = await propertiesAPI.getById(currentPropertyId);
      if (response.success) {
        setCurrentProperty(response.property);
      } else {
        console.error('Property not found');
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch current property:', err);
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAll({
        approvalStatus: 'approved',
        limit: 20
      });
      if (response.success) {
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

        // Filter properties by same country, then same city
        // Also filter out properties without images
        let filtered = response.properties.filter(p =>
          p._id !== currentPropertyId &&
          p.images &&
          p.images.length > 0
        );

        // Apply currency filter if not "ALL"
        if (selectedCurrency !== 'ALL') {
          const allowedCountries = currencyCountryMap[selectedCurrency] || [];
          filtered = filtered.filter(p =>
            allowedCountries.some(country =>
              p.country?.toLowerCase() === country.toLowerCase()
            )
          );
        }

        // First try to find properties in the same city and country
        let sameCityProperties = filtered.filter(
          p => p.city === currentProperty.city && p.country === currentProperty.country
        );

        // If not enough in same city, get properties from same country
        if (sameCityProperties.length < 5) {
          const sameCountryProperties = filtered.filter(
            p => p.country === currentProperty.country && p.city !== currentProperty.city
          );
          filtered = [...sameCityProperties, ...sameCountryProperties].slice(0, 5);
        } else {
          filtered = sameCityProperties.slice(0, 5);
        }

        // If still not enough, just show any approved properties (still respecting currency filter)
        if (filtered.length < 3) {
          filtered = response.properties
            .filter(p => {
              if (p._id === currentPropertyId) return false;
              if (!p.images || p.images.length === 0) return false; // Filter out properties without images
              if (selectedCurrency === 'ALL') return true;
              const allowedCountries = currencyCountryMap[selectedCurrency] || [];
              return allowedCountries.some(country =>
                p.country?.toLowerCase() === country.toLowerCase()
              );
            })
            .slice(0, 5);
        }

        setProperties(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No similar properties available at the moment</p>
      </div>
    );
  }

  // Construct image URL helper
  const getImageUrl = (property) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const backendUrl = apiUrl.replace(/\/api$/, '');
    if (property.images && property.images.length > 0) {
      return property.images[0].startsWith('http')
        ? property.images[0]
        : `${backendUrl}${property.images[0]}`;
    }
    return '/images/listings/listing-placeholder.jpg';
  };

  // Get currency symbol based on country
  const getCurrency = (country) => {
    const currencyMap = {
      'UAE': 'AED',
      'United Arab Emirates': 'AED',
      'USA': '$',
      'United States': '$',
      'UK': '£',
      'United Kingdom': '£',
      'India': '₹',
      'Europe': '€',
    };
    return currencyMap[country] || '$';
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".featured-next__active",
          prevEl: ".featured-prev__active",
        }}
        pagination={{
          el: ".featured-pagination__active",
          clickable: true,
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {properties.map((property) => (
          <SwiperSlide key={property._id}>
            <div className="item">
              <div className="listing-style1">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={getImageUrl(property)}
                    alt={property.title || property.propertyName}
                  />
                  <div className="list-price">
                    {getCurrency(property.country)} {property.price?.toLocaleString() || 0} / <span>mo</span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v1/${property._id}`}>
                      {property.title || property.propertyName}
                    </Link>
                  </h6>
                  <p className="list-text">{property.city}, {property.country}</p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-bed" /> {property.bedrooms || 0} {t('listing.bed')}
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {property.bathrooms || 0} {t('listing.bath')}
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {property.sizeInFt || 0} {t('listing.sqft')}
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">
                      {property.propertyAdType === 'rent' ? t('listing.forRent') : t('listing.forSale')}
                    </span>
                    <div className="icons d-flex align-items-center">
                      <Link href={`/single-v1/${property._id}`}>
                        <span className="flaticon-fullscreen" />
                      </Link>
                      <Link href={`/single-v1/${property._id}`} target="_blank">
                        <span className="flaticon-new-tab" />
                      </Link>
                      <a href="#">
                        <span className="flaticon-like" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default NearbySimilarProperty;
