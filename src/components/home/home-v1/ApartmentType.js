"use client";
import { getCategoryCounts } from "@/helpers/propertyApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ApartmentType = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const data = await getCategoryCounts();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching category counts:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const getCategoryUrl = (categoryTitle) => {
    // Convert category title to lowercase for API filtering
    const categoryName = categoryTitle.toLowerCase();
    return `/grid-default?category=${encodeURIComponent(categoryName)}`;
  };

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  if (categories.length === 0) {
    return <div className="text-center">No categories available</div>;
  }

  return (
    <Swiper
      className="overflow-visible"
      spaceBetween={30}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".next__active",
        prevEl: ".prev__active",
      }}
      pagination={{
        el: ".pagination__active",
        clickable: true,
      }}
      breakpoints={{
        300: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        992: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5.5,
          spaceBetween: 25,
        },
        1400: {
          slidesPerView: 6.5,
          spaceBetween: 30,
        },
      }}
    >
      {categories.map((type) => (
        <SwiperSlide key={type.id}>
          <div className="item">
            <Link href={getCategoryUrl(type.title)}>
              <div className="iconbox-style1">
                <span className={`icon ${type.icon}`} />
                <div className="iconbox-content">
                  <h6 className="title">{type.title}</h6>
                  <p className="text mb-0">{`${type.count} Properties`}</p>
                </div>
              </div>
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ApartmentType;
