"use client";

import { getCityCounts } from "@/helpers/propertyApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const PropertiesByCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getCityCounts();
        setCities(data || []);
      } catch (error) {
        console.error("Error fetching city counts:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://globperty-q5lh.onrender.com/api';
  const backendUrl = API_URL.replace('/api', '');

  const getImageUrl = (city) => {
    if (city.image) {
      const img = city.image;
      return img.startsWith('http') ? img : `${backendUrl}${img}`;
    }
    return '/images/listings/city-listing-1.png'; // fallback
  };

  if (loading) {
    return <div className="text-center">Loading cities...</div>;
  }

  if (cities.length === 0) {
    return <div className="text-center">No cities available</div>;
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation]}
        navigation={{
          nextEl: ".property-by-city-next__active",
          prevEl: ".property-by-city-prev__active",
        }}
        slidesPerView={1}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        }}
      >
        {cities.slice(0, 6).map((city) => (
          <SwiperSlide key={city.id}>
            <div className="item">
              <div className="feature-style1">
                <div className="feature-img">
                  <Image
                    width={400}
                    height={400}
                    className="w-100 h-100 cover"
                    src={getImageUrl(city)}
                    alt={city.name}
                  />
                </div>
                <div className="feature-content">
                  <div className="top-area">
                    <h6 className="title mb-1">{city.name}</h6>
                    <p className="text">{city.propertyCount} Properties</p>
                  </div>
                  <div className="bottom-area">
                    <Link className="ud-btn2" href={`/grid-default?city=${encodeURIComponent(city.name)}`}>
                      View Properties
                      <i className="fal fa-arrow-right-long" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="rounded-arrow arrowY-center-position">
        <button className="property-by-city-prev__active swiper_button _prev">
          <i className="far fa-chevron-left" />
        </button>
        {/* End prev */}

        <button className="property-by-city-next__active swiper_button _next">
          <i className="far fa-chevron-right" />
        </button>
        {/* End Next */}
      </div>
      {/* End .col for navigation  */}
    </>
  );
};

export default PropertiesByCities;
