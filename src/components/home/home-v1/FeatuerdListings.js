"use client";
import { getAllProperties } from "@/helpers/propertyApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
        // Get first 4 approved properties
        const approvedProps = data.filter(p => p.approvalStatus === 'approved').slice(0, 4);
        setProperties(approvedProps);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://16.16.211.219:5000/api';
  const backendUrl = API_URL.replace('/api', '');

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      return img.startsWith('http') ? img : `${backendUrl}${img}`;
    }
    return '/images/listings/list-1.jpg'; // fallback
  };

  if (loading) {
    return <div className="text-center">Loading properties...</div>;
  }

  if (properties.length === 0) {
    return <div className="text-center">No properties available</div>;
  }

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
        {properties.map((listing) => (
          <SwiperSlide key={listing.id || listing._id}>
            <div className="item">
              <div className="listing-style1">
                <div className="list-thumb">
                  <Image
                    width={382}
                    height={248}
                    className="w-100 h-100 cover"
                    src={getImageUrl(listing)}
                    alt={listing.title || "property"}
                  />
                  <div className="sale-sticker-wrap">
                    {listing.propertyType === 'Sale' && (
                      <div className="list-tag fz12">
                        <span className="flaticon-electricity me-2" />
                        FEATURED
                      </div>
                    )}
                  </div>

                  <div className="list-price">
                    ${listing.price?.toLocaleString() || '0'} {listing.afterPriceLabel && <span>/ {listing.afterPriceLabel}</span>}
                  </div>
                </div>
                <div className="list-content">
                  <h6 className="list-title">
                    <Link href={`/single-v1/${listing.id || listing._id}`}>
                      {listing.title || listing.name}
                    </Link>
                  </h6>
                  <p className="list-text">{listing.city}, {listing.country}</p>
                  <div className="list-meta d-flex align-items-center">
                    <a href="#">
                      <span className="flaticon-bed" /> {listing.bedrooms || 0} bed
                    </a>
                    <a href="#">
                      <span className="flaticon-shower" /> {listing.bathrooms || 0} bath
                    </a>
                    <a href="#">
                      <span className="flaticon-expand" /> {listing.sizeInFt || 0} sqft
                    </a>
                  </div>
                  <hr className="mt-2 mb-2" />
                  <div className="list-meta2 d-flex justify-content-between align-items-center">
                    <span className="for-what">For {listing.propertyType || 'Rent'}</span>
                    <div className="icons d-flex align-items-center">
                      <a href="#">
                        <span className="flaticon-fullscreen" />
                      </a>
                      <a href="#">
                        <span className="flaticon-new-tab" />
                      </a>
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

      <div className="row align-items-center justify-content-center">
        <div className="col-auto">
          <button className="featured-prev__active swiper_button">
            <i className="far fa-arrow-left-long" />
          </button>
        </div>
        {/* End prev */}

        <div className="col-auto">
          <div className="pagination swiper--pagination featured-pagination__active" />
        </div>
        {/* End pagination */}

        <div className="col-auto">
          <button className="featured-next__active swiper_button">
            <i className="far fa-arrow-right-long" />
          </button>
        </div>
        {/* End Next */}
      </div>
      {/* End .col for navigation and pagination */}
    </>
  );
};

export default FeaturedListings;
