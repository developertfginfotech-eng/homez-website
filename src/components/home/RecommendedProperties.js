'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { aiAPI } from '@/services/aiApi';

// Get backend URL from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function RecommendedProperties() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user preferences from localStorage if available
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let preferences = {};

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.preferences) {
            preferences = user.preferences;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      const response = await aiAPI.getRecommendations(preferences);

      if (response.success && response.data) {
        // Get top 6 recommendations
        setRecommendations(response.data.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="pb90 pb10-md pt-0">
        <div className="container">
          <div className="row align-items-center mb40">
            <div className="col-lg-12">
              <div className="main-title text-center">
                <h2 className="title">✨ Recommended for You</h2>
                <p className="paragraph">Properties matched to your preferences</p>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Finding your perfect matches...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <section className="pb90 pb10-md pt-0">
      <div className="container">
        <div className="row align-items-center mb40">
          <div className="col-lg-9">
            <div className="main-title">
              <h2 className="title">✨ Recommended for You</h2>
              <p className="paragraph">
                AI-powered recommendations based on your preferences
              </p>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="text-start text-lg-end mb-3">
              <Link
                href="/ai-recommendations"
                className="ud-btn2"
              >
                See All Properties
                <i className="fal fa-arrow-right-long ms-2" />
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          {recommendations.map((property, index) => (
            <div key={property._id} className="col-sm-6 col-lg-4 mb-4">
              <div className="listing-style1 h-100">
                {/* Match Score Badge */}
                <div
                  className="list-tag fz12 fw600 position-absolute"
                  style={{
                    top: '15px',
                    left: '15px',
                    backgroundColor: '#00796B',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {property.recommendationScore}% Match
                </div>

                {/* Property Image */}
                <div className="list-thumb">
                  <Link href={`/single-v1/${property._id}`}>
                    <img
                      className="w-100 h-100 cover"
                      style={{ height: '253px', objectFit: 'cover' }}
                      src={
                        property.images && property.images.length > 0 && property.images[0]
                          ? property.images[0].startsWith('http')
                            ? property.images[0]
                            : `${BACKEND_URL}${property.images[0]}`
                          : '/images/listings/lg-1.jpg'
                      }
                      alt={property.propertyName || property.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/listings/lg-1.jpg';
                      }}
                    />
                  </Link>

                  <div className="list-meta">
                    <Link href="#" className="fav">
                      <span className="flaticon-heart" />
                    </Link>
                  </div>
                </div>

                {/* Property Details */}
                <div className="list-content" style={{ paddingBottom: '20px' }}>
                  <div className="list-price">
                    ${property.price?.toLocaleString() || 'N/A'}
                    <span className="fz14">
                      {property.propertyAdType === 'rent' ? '/month' : ''}
                    </span>
                  </div>

                  <h6 className="list-title">
                    <Link href={`/single-v1/${property._id}`}>
                      {property.propertyName || property.title}
                    </Link>
                  </h6>

                  <p className="list-text">
                    {property.city}, {property.state || property.country}
                  </p>

                  {/* Match Reason */}
                  {property.reason && (
                    <div
                      className="mb-3 p-2"
                      style={{
                        backgroundColor: '#E0F2F1',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#00796B',
                        fontWeight: '500'
                      }}
                    >
                      <i className="fas fa-star me-1" />
                      {property.reason}
                    </div>
                  )}

                  {/* Property Features */}
                  <div className="list-meta d-flex align-items-center">
                    <span className="me-3">
                      <i className="flaticon-bed me-1" />
                      {property.bedrooms} Bed
                    </span>
                    <span className="me-3">
                      <i className="flaticon-shower me-1" />
                      {property.bathrooms} Bath
                    </span>
                    {property.builtUpArea && (
                      <span>
                        <i className="flaticon-expand me-1" />
                        {property.builtUpArea} Sq Ft
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <div className="mt15">
                    <Link
                      href={`/single-v1/${property._id}`}
                      className="ud-btn btn-thm"
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', fontSize: '14px', borderRadius: '8px' }}
                    >
                      View Details
                      <i className="fal fa-arrow-right-long ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
