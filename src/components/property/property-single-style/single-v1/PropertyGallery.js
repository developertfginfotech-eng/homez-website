"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { propertiesAPI } from "@/services/api";
import { useState, useEffect } from "react";

const PropertyGallery = ({id}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(id);
        if (response.property) {
          setData(response.property);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No images available</div>;
  }

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/listings/listing-single-1.jpg";
    // If it's already a full URL or a local path starting with /, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/images')) {
      return imagePath;
    }
    // Construct full URL for uploaded images
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://globperty-q5lh.onrender.com';
    return `${backendUrl}${imagePath}`;
  };

  const images = data.images && Array.isArray(data.images) && data.images.length > 0
    ? data.images.map(getImageUrl)
    : ["/images/listings/listing-single-1.jpg"];  // Fallback image

  const mainImage = images[0];
  const otherImages = images.slice(1, 5);  // Get up to 4 additional images
  return (
    <>
      <Gallery>
        <div className="col-sm-6">
          <div className="sp-img-content mb15-md">
            <div className="popup-img preview-img-1 sp-img">
              <Item
                original={mainImage}
                thumbnail={mainImage}
                width={610}
                height={510}
              >
                {({ ref, open }) => (
                  <Image
                    src={mainImage}
                    width={591}
                    height={558}
                    ref={ref}
                    onClick={open}
                    alt={data.title || "Property image"}
                    role="button"
                    className="w-100 h-100 cover"
                  />
                )}
              </Item>
            </div>
          </div>
        </div>
        {/* End .col-6 */}

        <div className="col-sm-6">
          <div className="row">
            {otherImages.map((imageSrc, index) => (
              <div className="col-6 ps-sm-0" key={index}>
                <div className="sp-img-content">
                  <div
                    className={`popup-img preview-img-${index + 2} sp-img mb10`}
                  >
                    <Item
                      original={imageSrc}
                      thumbnail={imageSrc}
                      width={270}
                      height={250}
                    >
                      {({ ref, open }) => (
                        <Image
                          width={270}
                          height={250}
                          className="w-100 h-100 cover"
                          ref={ref}
                          onClick={open}
                          role="button"
                          src={imageSrc}
                          alt={`${data.title || "Property"} ${index + 2}`}
                        />
                      )}
                    </Item>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
