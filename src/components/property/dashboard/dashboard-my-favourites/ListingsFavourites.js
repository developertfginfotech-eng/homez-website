"use client";
import React, { useState, useEffect } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { favoritesAPI } from "@/services/api";
import Image from "next/image";
import Link from "next/link";

const ListingsFavourites = () => {
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getAll();
      if (response.success) {
        setFavoriteListings(response.favorites || []);
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (propertyId) => {
    try {
      await favoritesAPI.remove(propertyId);
      // Remove from local state
      const updatedListings = favoriteListings.filter(
        (fav) => fav.propertyId._id !== propertyId
      );
      setFavoriteListings(updatedListings);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      alert('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      {favoriteListings.length === 0 ? (
        <div className="col-12 text-center py-5">
          <i className="flaticon-like text-muted" style={{ fontSize: "64px" }} />
          <h3 className="mt-3">No Favorites Yet</h3>
          <p className="text-muted">Properties you favorite will appear here</p>
          <Link href="/list-v1" className="ud-btn btn-thm mt-3">
            Browse Properties
            <i className="fal fa-arrow-right-long ms-2" />
          </Link>
        </div>
      ) : (
        favoriteListings.map((favorite) => {
          const property = favorite.propertyId;
          if (!property) return null;

          // Construct image URL
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          const backendUrl = apiUrl.replace(/\/api$/, '');
          const imageUrl = property.images && property.images.length > 0
            ? (property.images[0].startsWith('http') ? property.images[0] : `${backendUrl}${property.images[0]}`)
            : '/images/listings/listing-placeholder.jpg';

          return (
            <div className="col-md-6 col-lg-4 col-xl-3" key={favorite._id}>
              <div className="listing-style1 style2">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={imageUrl}
                    alt={property.title || property.propertyName}
                  />

                  <button
                    className="tag-del"
                    title="Remove from Favorites"
                    onClick={() => handleDeleteListing(property._id)}
                    style={{ border: "none" }}
                    data-tooltip-id={`delete-${favorite._id}`}
                  >
                    <span className="fas fa-trash-can"></span>
                  </button>

                  <ReactTooltip
                    id={`delete-${favorite._id}`}
                    place="left"
                    content="Remove from Favorites"
                  />

                  <div className="list-price">
                    ${property.price?.toLocaleString() || 0} / <span>mo</span>
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v1/${property._id}`}>
                      {property.title || property.propertyName}
                    </Link>
                  </h6>
                  <p className="list-text">
                    {property.city}, {property.country}
                  </p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-bed" /> {property.bedrooms || 0} bed
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {property.bathrooms || 0} bath
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {property.sizeInFt || 0} sqft
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">
                      {property.propertyAdType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <div className="icons d-flex align-items-center">
                      <Link href={`/single-v1/${property._id}`}>
                        <span className="flaticon-fullscreen" />
                      </Link>
                      <Link href={`/single-v1/${property._id}`} target="_blank">
                        <span className="flaticon-new-tab" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(property._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span className="flaticon-like text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default ListingsFavourites;
