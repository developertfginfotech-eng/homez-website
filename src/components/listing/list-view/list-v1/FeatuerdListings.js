"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { favoritesAPI } from "@/services/api";

const FeaturedListings = ({ data, colstyle }) => {
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    // Check which properties are favorited
    const checkFavorites = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const favoriteStatus = {};
      for (const listing of data) {
        try {
          const response = await favoritesAPI.checkFavorite(listing.id);
          if (response.success) {
            favoriteStatus[listing.id] = response.isFavorited;
          }
        } catch (err) {
          console.error('Failed to check favorite:', err);
        }
      }
      setFavorites(favoriteStatus);
    };

    checkFavorites();
  }, [data]);

  const handleFavoriteClick = async (e, listingId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(prev => ({ ...prev, [listingId]: true }));

    try {
      const isFavorited = favorites[listingId];

      if (isFavorited) {
        // Remove from favorites
        await favoritesAPI.remove(listingId);
        setFavorites(prev => ({ ...prev, [listingId]: false }));
      } else {
        // Add to favorites
        await favoritesAPI.add(listingId);
        setFavorites(prev => ({ ...prev, [listingId]: true }));
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      alert('Failed to update favorites');
    } finally {
      setLoading(prev => ({ ...prev, [listingId]: false }));
    }
  };

  return (
    <>
      {data.map((listing) => {
        const isFavorited = favorites[listing.id] || false;
        const isLoading = loading[listing.id] || false;

        return (
          <div
            className={` ${colstyle ? "col-sm-6 col-lg-6" : "col-sm-12"}  `}
            key={listing.id}
          >
            <div
              className={
                colstyle
                  ? "listing-style1"
                  : "listing-style1 listCustom listing-type"
              }
            >
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100  cover"
                  style={{ height: "253px" }}
                  src={listing.image}
                  alt="listings"
                />
                <div className="list-price">
                  {listing.price} / <span>mo</span>
                </div>
              </div>
              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v4/${listing.id}`}>{listing.title}</Link>
                </h6>
                <p className="list-text">{listing.location}</p>
                <div className="list-meta d-flex align-items-center">
                  <a href="#">
                    <span className="flaticon-bed" /> {listing.bed} bed
                  </a>
                  <a href="#">
                    <span className="flaticon-shower" /> {listing.bath} bath
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" /> {listing.sqft} sqft
                  </a>
                </div>
                <p className="list-text2">
                  {listing.description || "An exceptional exclusive five bedroom apartment for sale in this much sought after development in Knightsbridge."}
                </p>
                <hr className="mt-2 mb-2" />
                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">
                    {listing.forRent ? "For Rent" : "For Sale"}
                  </span>
                  <div className="icons d-flex align-items-center">
                    <Link href={`/single-v4/${listing.id}`}>
                      <span className="flaticon-fullscreen" />
                    </Link>
                    <Link href={`/single-v4/${listing.id}`} target="_blank">
                      <span className="flaticon-new-tab" />
                    </Link>
                    <button
                      onClick={(e) => handleFavoriteClick(e, listing.id)}
                      disabled={isLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: isLoading ? 'wait' : 'pointer',
                        padding: '0',
                        marginLeft: '10px'
                      }}
                      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <span
                        className="flaticon-like"
                        style={{
                          color: isFavorited ? '#eb6753' : 'inherit',
                          fontSize: '16px',
                          transition: 'color 0.3s ease'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FeaturedListings;
