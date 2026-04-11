"use client";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import { propertiesAPI } from "@/services/api";

const GalleryBox = ({ id }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(id);
        if (response.property) {
          const prop = response.property;

          // Construct image URLs
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          const backendUrl = API_URL.replace('/api', '');

          if (prop.images && prop.images.length > 0) {
            const urls = prop.images.map(img => {
              return img.startsWith('http') ? img : `${backendUrl}${img}`;
            });
            setImageUrls(urls);
          } else {
            // Fallback image
            setImageUrls(["/images/listings/listing-single-slide4.jpg"]);
          }
        }
      } catch (error) {
        console.error('Error fetching property images:', error);
        setImageUrls(["/images/listings/listing-single-slide4.jpg"]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading images...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Swiper
        spaceBetween={0}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".single-pro-slide-next__active",
          prevEl: ".single-pro-slide-prev__active",
        }}
        slidesPerView={1}
        loop={true}
        speed={1000}
      >
        {imageUrls.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <div className="item">
              <Image
                width={1519}
                height={475}
                className=" w-100 h-100 cover"
                src={imageUrl}
                alt={`Property Image ${index + 1}`}
                onError={(e) => {
                  e.target.src = '/images/listings/listing-single-slide4.jpg';
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="single-pro-slide-prev__active swiper_button _prev">
          <i className="far fa-arrow-left-long" />
        </button>
        {/* End prev */}

        <button className="single-pro-slide-next__active swiper_button _next">
          <i className="far fa-arrow-right-long" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default GalleryBox;
