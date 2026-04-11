"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const PropertyCard = ({ property }) => {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://homez-q5lh.onrender.com/api";
  const backendUrl = API_URL.replace("/api", "");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/listings/listing-1.jpg";
    return imageUrl.startsWith("http") ? imageUrl : `${backendUrl}${imageUrl}`;
  };

  // Get property images
  const propertyImages = property.images && property.images.length > 0
    ? property.images.map(img => getImageUrl(img))
    : ["/images/listings/listing-1.jpg"];

  const hasMultipleImages = propertyImages.length >= 2;

  // Auto-rotate images if there are multiple
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
        setIsAnimating(false);
      }, 300);
    }, 3500); // Change image every 3.5 seconds

    return () => clearInterval(interval);
  }, [hasMultipleImages, propertyImages.length]);

  // Get currency based on country
  const getCurrencyByCountry = (country) => {
    const currencyMap = {
      'Australia': 'AUD',
      'UAE': 'AED',
      'United Arab Emirates': 'AED',
      'USA': 'USD',
      'United States': 'USD',
      'US': 'USD',
      'UK': 'GBP',
      'United Kingdom': 'GBP',
      'Canada': 'CAD',
      'India': 'INR',
      'Portugal': 'EUR',
      'Cyprus': 'EUR',
      'Malta': 'EUR',
      'Germany': 'EUR',
      'France': 'EUR',
    };
    return currencyMap[country] || 'USD';
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      'USD': '$',
      'AED': 'AED ',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'CA$',
      'AUD': 'A$',
      'INR': '₹',
    };
    return symbols[currencyCode] || '$';
  };

  const currency = getCurrencyByCountry(property.country);
  const currencySymbol = getCurrencySymbol(currency);

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .luxury-property-card {
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          background-clip: padding-box;
          position: relative;
          animation: slideIn 0.6s ease-out;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .luxury-property-card::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.2) 0%, rgba(220, 60, 40, 0.2) 100%);
          border-radius: 24px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .luxury-property-card:hover::after {
          opacity: 1;
        }

        .luxury-property-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #eb6753 0%, #dc3c28 50%, #eb6753 100%);
          transform: scaleX(0);
          transition: transform 0.5s ease;
        }

        .luxury-property-card:hover::before {
          transform: scaleX(1);
        }

        .luxury-property-card:hover {
          box-shadow: 0 24px 64px rgba(235, 103, 83, 0.25), 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-12px) scale(1.02);
        }

        .property-image-wrapper {
          position: relative;
          width: 100%;
          height: 260px;
          overflow: hidden;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%);
        }

        .property-image-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%);
          transform: rotate(45deg);
          opacity: 0;
          transition: opacity 0.6s ease;
          z-index: 1;
          pointer-events: none;
        }

        .luxury-property-card:hover .property-image-wrapper::before {
          opacity: 1;
          animation: shine 1.5s ease-in-out;
        }

        @keyframes shine {
          0% {
            left: -150%;
          }
          100% {
            left: 150%;
          }
        }

        .property-image-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .luxury-property-card:hover .property-image-wrapper::after {
          opacity: 1;
        }

        .property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
          opacity: ${isAnimating ? 0 : 1};
        }

        .luxury-property-card:hover .property-image {
          transform: scale(1.1);
        }

        .image-indicators {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 2;
          opacity: ${hasMultipleImages ? 1 : 0};
          pointer-events: ${hasMultipleImages ? 'auto' : 'none'};
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .indicator-dot.active {
          width: 24px;
          border-radius: 4px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .indicator-dot:hover:not(.active) {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }

        .image-counter {
          position: absolute;
          top: 16px;
          right: ${hasMultipleImages ? '80px' : '16px'};
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
          display: ${hasMultipleImages ? 'flex' : 'none'};
          align-items: center;
          gap: 4px;
        }

        .image-counter i {
          font-size: 10px;
        }

        .property-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 8px 16px;
          background: ${property.propertyAdType === "rent"
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
          color: white;
          border-radius: 25px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          box-shadow: 0 4px 15px ${property.propertyAdType === "rent"
            ? "rgba(59, 130, 246, 0.4)"
            : "rgba(16, 185, 129, 0.4)"};
          z-index: 2;
        }

        .property-price {
          position: absolute;
          bottom: 20px;
          right: 20px;
          padding: 14px 24px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.98) 0%, rgba(220, 60, 40, 0.98) 100%);
          backdrop-filter: blur(12px) saturate(180%);
          color: white;
          border-radius: 40px;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 12px 32px rgba(235, 103, 83, 0.45), 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 3;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          letter-spacing: 0.5px;
        }

        .luxury-property-card:hover .property-price {
          transform: scale(1.08) translateY(-4px);
          box-shadow: 0 16px 48px rgba(235, 103, 83, 0.6), 0 8px 16px rgba(0, 0, 0, 0.25);
        }

        .price-period {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.9;
          margin-left: 2px;
        }

        .property-content {
          padding: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          position: relative;
        }

        .property-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 20px;
          right: 20px;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(235, 103, 83, 0.3) 50%,
            transparent 100%);
        }

        .property-title {
          font-size: 18px;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 10px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 48px;
          letter-spacing: -0.3px;
        }

        .property-title a {
          color: #1f2937;
          text-decoration: none;
          transition: all 0.3s ease;
          background: linear-gradient(90deg, #eb6753 0%, #dc3c28 100%);
          background-size: 0% 2px;
          background-repeat: no-repeat;
          background-position: left bottom;
        }

        .property-title a:hover {
          color: #eb6753;
          background-size: 100% 2px;
        }

        .property-location {
          font-size: 13px;
          color: #4b5563;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.06) 0%, rgba(235, 103, 83, 0.02) 100%);
          border-radius: 12px;
          border: 1px solid rgba(235, 103, 83, 0.1);
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .property-location:hover {
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.1) 0%, rgba(235, 103, 83, 0.04) 100%);
          border-color: rgba(235, 103, 83, 0.2);
          transform: translateX(4px);
        }

        .location-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #eb6753 0%, #dc3c28 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(235, 103, 83, 0.3);
          transition: all 0.3s ease;
        }

        .property-location:hover .location-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 16px rgba(235, 103, 83, 0.4);
        }

        .property-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding-top: 12px;
          border-top: 2px solid #f3f4f6;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4b5563;
          font-weight: 600;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .meta-item:hover {
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.05) 0%, rgba(235, 103, 83, 0.02) 100%);
          border-color: rgba(235, 103, 83, 0.3);
          transform: translateY(-2px);
        }

        .meta-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(235, 103, 83, 0.1) 0%, rgba(235, 103, 83, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meta-icon i {
          color: #eb6753;
          font-size: 13px;
        }

        .featured-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
          z-index: 2;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .featured-badge i {
          color: white;
          font-size: 16px;
        }
      `}</style>

      <div className="luxury-property-card">
        <div className="property-image-wrapper">
          <Image
            key={currentImageIndex}
            width={400}
            height={260}
            className="property-image"
            src={propertyImages[currentImageIndex]}
            alt={`${property.propertyName || "Property"} - Image ${currentImageIndex + 1}`}
          />

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="image-counter">
              <i className="fas fa-images"></i>
              <span>{currentImageIndex + 1}/{propertyImages.length}</span>
            </div>
          )}

          {/* Property Badge */}
          <div className="property-badge">
            {property.propertyAdType === "rent" ? "For Rent" : "For Sale"}
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="featured-badge">
              <i className="fas fa-star"></i>
            </div>
          )}

          {/* Image Indicators */}
          {hasMultipleImages && (
            <div className="image-indicators">
              {propertyImages.map((_, index) => (
                <div
                  key={index}
                  className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setIsAnimating(false);
                    }, 300);
                  }}
                />
              ))}
            </div>
          )}

          {/* Price Badge */}
          <div className="property-price">
            {currencySymbol}
            {property.price ? property.price.toLocaleString() : "N/A"}
            {property.propertyAdType === "rent" && <span className="price-period">/mo</span>}
          </div>
        </div>

        <div className="property-content">
          <h6 className="property-title">
            <Link href={`/single-v1/${property._id}`}>
              {property.propertyName || "Property"}
            </Link>
          </h6>

          <div className="property-location">
            <div className="location-icon">
              <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '11px' }}></i>
            </div>
            <span>
              {property.locality && `${property.locality}, `}
              {property.city}
            </span>
          </div>

          <div className="property-meta">
            {property.superBuiltUpArea && (
              <div className="meta-item">
                <div className="meta-icon">
                  <i className="fas fa-expand-arrows-alt"></i>
                </div>
                <span>{property.superBuiltUpArea} sqft</span>
              </div>
            )}
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-home"></i>
              </div>
              <span>{property.propertyType || 'Property'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
