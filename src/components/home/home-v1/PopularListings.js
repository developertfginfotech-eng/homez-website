"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

const PopularListings = ({ data = [] }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://16.16.211.219:5000/api';
  const backendUrl = API_URL.replace('/api', '');

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      return img.startsWith('http') ? img : `${backendUrl}${img}`;
    }
    return '/images/listings/list-1.jpg'; // fallback
  };

  if (data.length === 0) {
    return <div className="text-center text-white">No properties available</div>;
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
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
            slidesPerView: 4,
          },
        }}
      >
        {data.slice(0, 8).map((listing) => (
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
                    <Link href={`/single-v2/${listing.id || listing._id}`}>
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
    </>
  );
};

export default PopularListings;
