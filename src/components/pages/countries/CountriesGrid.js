"use client";

import Link from "next/link";
import { getAllCountryDetails } from "@/data/countryDetails";

const CountriesGrid = () => {
  const countries = getAllCountryDetails();

  // Country images mapping - Using Unsplash
  const countryImages = {
    Australia: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop&q=80', // Sydney Opera House
    UAE: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=80', // Dubai
    'United Arab Emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop&q=80',
    USA: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop&q=80', // New York
    'United States': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&h=600&fit=crop&q=80',
    UK: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&q=80', // London
    'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&q=80',
    Canada: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop&q=80', // Toronto
    India: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop&q=80', // India Gate
    Germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop&q=80', // Brandenburg Gate
    France: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop&q=80', // Paris
  };

  return (
    <div className="row">
      {countries.map((country) => (
        <div key={country.slug} className="col-sm-6 col-lg-4 col-xl-3 mb30">
          <Link href={`/country-details/${country.slug}`} style={{ textDecoration: 'none' }}>
            <div className="country-card bdrs12 overflow-hidden position-relative" style={{
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}>
              <div
                className="country-image"
                style={{
                  height: '240px',
                  background: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.6)), url(${countryImages[country.name] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  transition: 'transform 0.4s ease'
                }}
              >
                <div className="position-absolute bottom-0 start-0 p20 w-100">
                  <h5 className="text-white mb5">{country.name}</h5>
                  <p className="text-white mb-0 fz14 opacity-75">
                    {country.economy.keyIndustries.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              <div className="country-info p20 bgc-white">
                <div className="row mb15">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <span className="flaticon-dollar text-thm me-2 fz20" />
                      <div>
                        <p className="mb-0 fz12 text-muted">Currency</p>
                        <p className="mb-0 fw600 fz14">{country.currency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <span className="flaticon-increase text-thm me-2 fz20" />
                      <div>
                        <p className="mb-0 fz12 text-muted">GDP Growth</p>
                        <p className="mb-0 fw600 fz14">{country.economy.gdpGrowth}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="d-flex flex-wrap gap-2">
                      {country.popularCities.slice(0, 3).map((city, index) => (
                        <span key={index} className="badge bgc-thm-light text-thm fz12">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt15 pt15 border-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text fz14">
                      {country.benefits.length} Benefits
                    </span>
                    <span className="text-thm fw600 fz14">
                      View Details <i className="fal fa-arrow-right ms-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CountriesGrid;
