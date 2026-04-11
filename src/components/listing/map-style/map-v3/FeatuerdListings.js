"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const FeaturedListings = ({data,colstyle}) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteProperties');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  return (
    <>
      {data.map((listing) => (
        <div   className={` ${colstyle ? 'col-sm-12':'col-sm-6'}  `} key={listing.id}>
          <div className={colstyle ? "listing-style7 listCustom listing-type" : "listing-style7"}>
            <div className="list-thumb"    >
              <Image
                width={382}
                height={248}
                className="w-100 cover"
                src={listing.image}
                alt="listings"
                style={{ height: "250px" }}
              />
              <div className="sale-sticker-wrap">
                {listing.forRent && (
                  <div className="list-tag rounded-0 fz12">
                    <span className="flaticon-electricity" />
                    FEATURED
                  </div>
                )}
                <div className="list-tag2 fz12">FOR SALE</div>
              </div>
              <div className="list-meta">
                <a href="#" className="mr5">
                  <span className="flaticon-fullscreen" />
                </a>
                <a href="#" className="mr5">
                  <span className="flaticon-new-tab" />
                </a>
                <a
                  href="#"
                  onClick={(e) => toggleFavorite(e, listing.id)}
                  style={{ color: isFavorite(listing.id) ? '#ff5a5f' : 'inherit' }}
                >
                  <span className={isFavorite(listing.id) ? "flaticon-heart-2" : "flaticon-like"} />
                </a>
              </div>
            </div>
            <div className="list-content">
              <h6 className="list-title">
                <Link href={`/single-v5/${listing.id}`}>{listing.title}</Link>
              </h6>

              <div className="d-flex justify-content-between align-items-center">
                <div className="list-price">
                  {listing.price} / <span>mo</span>
                </div>
                <div className="list-meta2 d-flex align-items-center">
                  <a href="#" className="mr10">
                    <span className="flaticon-bed mr5" /> {listing.bed}
                  </a>
                  <a href="#" className="mr10">
                    <span className="flaticon-shower mr5" /> {listing.bath}
                  </a>
                  <a href="#">
                    <span className="flaticon-expand" /> {listing.sqft}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedListings;
