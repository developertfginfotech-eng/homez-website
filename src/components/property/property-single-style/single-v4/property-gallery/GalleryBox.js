"use client";
import { propertiesAPI } from "@/services/api";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

const GalleryBox = ({ id }) => {
  const [imageUrls, setImageUrls] = useState([
    "/images/listings/listing-single-slide1.jpg",
    "/images/listings/listing-single-slide2.jpg",
    "/images/listings/listing-single-slide3.jpg",
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await propertiesAPI.getById(id);
        if (response.success && response.property?.images?.length > 0) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          const backendUrl = API_URL.replace('/api', '');

          const propertyImages = response.property.images.map(img =>
            img.startsWith('http') ? img : `${backendUrl}${img}`
          );
          setImageUrls(propertyImages);
        }
      } catch (error) {
        console.error('Error fetching property images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyImages();
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
      <style jsx>{`
        .gallery-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1399px) {
          .gallery-container {
            max-width: 1000px;
          }
        }

        @media (max-width: 1199px) {
          .gallery-container {
            max-width: 900px;
          }
        }
      `}</style>

      <div className="gallery-container">
        <Swiper
          className="overflow-visible"
          spaceBetween={30}
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".single-pro-slide-next__active",
            prevEl: ".single-pro-slide-prev__active",
          }}
          slidesPerView={1}
          initialSlide={0}
          loop={imageUrls.length > 1}
        >
          {imageUrls.map((imageUrl, index) => (
            <SwiperSlide key={index}>
              <div className="item" style={{ height: '500px', overflow: 'hidden', borderRadius: '12px' }}>
                <Image
                  width={1200}
                  height={500}
                  className="w-100"
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  src={imageUrl}
                  alt={`Property Image ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/images/listings/listing-single-slide1.jpg';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="rounded-arrow arrowY-center-position">
          <button className="single-pro-slide-prev__active swiper_button _prev">
            <i className="far fa-chevron-left" />
          </button>
          {/* End prev */}

          <button className="single-pro-slide-next__active swiper_button _next">
            <i className="far fa-chevron-right" />
          </button>
          {/* End Next */}
        </div>
        {/* End .col for navigation  */}
      </div>
    </>
  );
};

export default GalleryBox;
