"use client";
import { getAllProperties } from "@/helpers/propertyApi";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslate } from "@/hooks/useTranslate";

const ApartmentTypes = () => {
  const { t } = useTranslate();
  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get translated property type name
  const getTranslatedPropertyType = (type) => {
    const typeMap = {
      'Houses': 'propertyTypes.houses',
      'House': 'propertyTypes.houses',
      'Apartments': 'propertyTypes.apartments',
      'Apartment': 'propertyTypes.apartments',
      'Office': 'propertyTypes.office',
      'Villa': 'propertyTypes.villa',
      'Townhome': 'propertyTypes.townhome',
      'Bungalow': 'propertyTypes.bungalow',
      'Loft': 'propertyTypes.loft',
    };
    return typeMap[type] ? t(typeMap[type]) : type;
  };

  useEffect(() => {
    const fetchApartmentTypes = async () => {
      try {
        const properties = await getAllProperties();
        const approvedProps = properties.filter(p => p.approvalStatus === 'approved');

        // Group properties by property type
        const typeMap = {};
        approvedProps.forEach(property => {
          const type = property.propertyType || 'Other';

          if (!typeMap[type]) {
            typeMap[type] = {
              title: type,
              properties: 0,
              imageSrc: property.images && property.images.length > 0
                ? (property.images[0].startsWith('http')
                  ? property.images[0]
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://homez-q5lh.onrender.com'}${property.images[0]}`)
                : '/images/listings/apartment-1.png'
            };
          }
          typeMap[type].properties++;
        });

        // Convert to array and sort by property count
        const typesArray = Object.values(typeMap)
          .sort((a, b) => b.properties - a.properties);

        setApartmentTypes(typesArray);
      } catch (error) {
        console.error('Error fetching apartment types:', error);
        setApartmentTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartmentTypes();
  }, []);

  if (loading) {
    return <div className="text-center py-4">{t('sections.loadingApartmentTypes')}</div>;
  }

  if (apartmentTypes.length === 0) {
    return <div className="text-center py-4">{t('sections.noApartmentTypes')}</div>;
  }

  return (
    <>
      <Swiper
        spaceBetween={30}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".apartment-type2-next__active",
          prevEl: ".apartment-type2-prev__active",
        }}
        pagination={{
          el: ".apartment-type2_pagination__active",
          clickable: true,
        }}
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
        }}
      >
        {apartmentTypes.map((apartment, index) => (
          <SwiperSlide key={`${apartment.title}-${index}`}>
            <div className="item">
              <Link href={`/grid-full-4-col?type=${apartment.title}`}>
                <div className="apartment-style1">
                  <div className="apartment-img" style={{ width: '100%', height: '223px', overflow: 'hidden' }}>
                    <Image
                      width={217}
                      height={223}
                      className="w-100 cover"
                      style={{ objectFit: 'cover', width: '100%', height: '223px' }}
                      src={apartment.imageSrc}
                      alt={apartment.title}
                      onError={(e) => {
                        e.target.src = '/images/listings/apartment-1.png';
                      }}
                    />
                  </div>
                  <div className="apartment-content">
                    <h6 className="title mb-0">{getTranslatedPropertyType(apartment.title)}</h6>
                    <p className="text mb-0">
                      {apartment.properties} {apartment.properties === 1 ? t('sections.property') : t('sections.properties')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ApartmentTypes;
