"use client";
import { getAllProperties } from "@/helpers/propertyApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { filterPropertiesByCurrency, getCurrencySymbol, getSelectedCurrency } from "@/utils/currencyHelper";
import { useTranslation } from "react-i18next";

const FilterProperties = () => {
  const { t } = useTranslation('common');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("house");
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");

  // Note: Properties are now pre-translated on the backend
  // No need for client-side translation anymore!

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        // Get approved properties with images
        const approvedProps = data.filter(p =>
          p.approvalStatus === 'approved' &&
          p.images &&
          p.images.length > 0
        );
        setProperties(approvedProps);

        // Apply currency filter
        const currency = getSelectedCurrency();
        setSelectedCurrency(currency);
        const filtered = filterPropertiesByCurrency(approvedProps, currency);
        setFilteredProperties(filtered);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Listen for currency change events
    const handleCurrencyChange = (event) => {
      const newCurrency = event.detail.currency;
      setSelectedCurrency(newCurrency);
      const filtered = filterPropertiesByCurrency(properties, newCurrency);
      setFilteredProperties(filtered);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  // Re-filter when properties or tag changes
  useEffect(() => {
    if (properties.length > 0) {
      let filtered = filterPropertiesByCurrency(properties, selectedCurrency);

      // Filter by property type based on selected tag
      if (selectedTag !== 'all') {
        filtered = filtered.filter(prop => {
          const propType = (prop.propertyType || '').toLowerCase();
          const tag = selectedTag.toLowerCase();

          // Handle both singular and plural forms
          // e.g., "apartments" should match "apartment" and vice versa
          if (tag === 'apartments' || tag === 'apartment') {
            return propType.includes('apartment');
          } else if (tag === 'houses' || tag === 'house') {
            return propType.includes('house');
          } else if (tag === 'villas' || tag === 'villa') {
            return propType.includes('villa');
          } else if (tag === 'offices' || tag === 'office') {
            return propType.includes('office');
          } else {
            return propType.includes(tag);
          }
        });
      }

      setFilteredProperties(filtered);
    }
  }, [properties, selectedCurrency, selectedTag]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
  const backendUrl = API_URL.replace('/api', '');

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      return img.startsWith('http') ? img : `${backendUrl}${img}`;
    }
    return '/images/listings/list-1.jpg'; // fallback
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">{t('common.loading')}</p>
    </div>;
  }

  // Show properties immediately, translation happens in background
  // This prevents the page from appearing stuck

  const displayProperties = filteredProperties.slice(0, 6);

  return (
    <>
      <div className="row wow fadeInUp" data-wow-delay="100ms">
        <div className="col-lg-6">
          <div className="main-title2">
            <h2 className="title">{t('sections.discoverPopularProperties')}</h2>
            <p className="paragraph">{t('sections.exploreRealEstate')}</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="dark-light-navtab style2 text-start text-lg-end mt-0 mt-lg-4 mb-4">
            <ul className="nav nav-pills justify-content-start justify-content-lg-end">
              <li className="nav-item">
                <button
                  className={`nav-link mb10-sm ${
                    selectedTag === "house" ? "active" : ""
                  }`}
                  onClick={() => handleTagClick("house")}
                >
                  {t('propertyTypes.houses')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link mb10-sm ${
                    selectedTag === "villa" ? "active" : ""
                  }`}
                  onClick={() => handleTagClick("villa")}
                >
                  {t('propertyTypes.villa')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link mb10-sm ${
                    selectedTag === "office" ? "active" : ""
                  }`}
                  onClick={() => handleTagClick("office")}
                >
                  {t('propertyTypes.office')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link mb10-sm ${
                    selectedTag === "apartments" ? "active" : ""
                  }`}
                  onClick={() => handleTagClick("apartments")}
                >
                  {t('propertyTypes.apartments')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* End .row */}

      <div className="row">
        <div className="col-lg-12" data-aos="fade-up" data-aos-delay="300">
          <div className="tab-content">
            {displayProperties.length === 0 ? (
              <div className="text-center py-5">
                <p>No properties available for the selected filter.</p>
                {selectedCurrency !== 'ALL' && (
                  <small className="text-muted">Try selecting "All Currencies" from the header.</small>
                )}
              </div>
            ) : (
              <div className="row">
                {displayProperties.map((listing) => (
                  <div className="col-md-6 col-xl-4" key={listing.id || listing._id}>
                    <div className="listing-style6">
                      <div className="list-thumb" style={{ width: '100%', height: '334px', overflow: 'hidden', position: 'relative' }}>
                        <Image
                          width={386}
                          height={334}
                          className="cover"
                          style={{ objectFit: 'cover', width: '100%', height: '334px' }}
                          src={getImageUrl(listing)}
                          alt={listing.title || listing.name}
                        />

                        <div className="sale-sticker-wrap">
                          {listing.propertyAdType !== 'rent' && (
                            <div className="list-tag fz12">
                              <span className="flaticon-electricity me-2" />
                              FEATURED
                            </div>
                          )}
                        </div>

                        <div className="list-meta">
                          <div className="icons">
                            <a href="#">
                              <span className="flaticon-like" />
                            </a>
                            <a href="#">
                              <span className="flaticon-new-tab" />
                            </a>
                            <a href="#">
                              <span className="flaticon-fullscreen" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="list-content">
                        <div className="list-price mb-2">
                          {getCurrencySymbol(listing.country)} {listing.price?.toLocaleString() || listing.expectedPrice?.toLocaleString() || '0'}
                        </div>
                        <h6 className="list-title">
                          <Link href={`/single-v4/${listing.id || listing._id}`}>
                            {listing.title || listing.name}
                          </Link>
                        </h6>
                        <p className="list-text">{listing.city}, {listing.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterProperties;
