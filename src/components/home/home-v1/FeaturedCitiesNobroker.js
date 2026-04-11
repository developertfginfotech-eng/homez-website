"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCityCounts } from "@/helpers/propertyApi";

const FeaturedCitiesNobroker = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchCities = async () => {
      try {
        const cityData = await getCityCounts();
        // Backend API URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

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

        // Filter cities by selected currency
        let filteredCityData = cityData;
        if (selectedCurrency !== 'ALL') {
          const allowedCountries = currencyCountryMap[selectedCurrency] || [];
          filteredCityData = cityData.filter(city =>
            allowedCountries.some(country =>
              city.country?.toLowerCase() === country.toLowerCase()
            )
          );
        }

        // Get top 6 cities and format them for display
        const formattedCities = filteredCityData.slice(0, 6).map((city, index) => {
          // Construct full image URL from backend
          let imageUrl = `/images/listings/listing-${index + 1}.jpg`;
          if (city.image) {
            imageUrl = city.image.startsWith('http') ? city.image : `${backendUrl}${city.image}`;
          }

          return {
            name: city.city,
            properties: `${city.count.toLocaleString()}+ Properties`,
            image: imageUrl,
            link: `/grid-full-3-col?city=${city.city.toLowerCase()}`,
            country: city.country,
          };
        });
        setCities(formattedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Set empty array on error
        setCities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [selectedCurrency]);

  if (loading) {
    return (
      <section className="pt60 pb60 bgc-f7">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading cities...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cities.length === 0) {
    return null; // Don't show section if no cities
  }

  return (
    <section className="pt60 pb60 bgc-f7">
      <div className="container">
        <div className="row mb40">
          <div className="col-lg-8">
            <h2 className="title" style={{ fontSize: "32px", fontWeight: "700", color: "#2d3748" }}>
              Explore Properties by Cities
            </h2>
            <p className="text-muted fz16" style={{ marginTop: "10px" }}>
              Find the best properties in top cities worldwide
            </p>
          </div>
          <div className="col-lg-4 text-end">
            <Link href="/grid-full-3-col" className="btn" style={{
              backgroundColor: "transparent",
              color: "#eb6753",
              border: "2px solid #eb6753",
              padding: "10px 25px",
              fontSize: "15px",
              fontWeight: "600",
              borderRadius: "8px",
              transition: "all 0.3s ease",
            }}>
              View All Cities <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {cities.map((city, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link href={city.link}>
                <div
                  className="city-card"
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "250px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="city-overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "25px",
                    }}
                  >
                    <h3 className="mb-1" style={{ fontSize: "28px", fontWeight: "700", color: "white" }}>
                      {city.name}
                    </h3>
                    <p className="mb-0" style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)", fontWeight: "500" }}>
                      {city.properties}
                    </p>
                    {city.country && (
                      <p className="mb-0 mt-1" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: "400" }}>
                        {city.country}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCitiesNobroker;
