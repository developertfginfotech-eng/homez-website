"use client";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getPropertyById } from "@/helpers/propertyApi";

const PropertyGallery = ({ id }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const property = await getPropertyById(id);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://homez-q5lh.onrender.com/api';
        const backendUrl = API_URL.replace('/api', '');

        // Convert API images to gallery format
        let propertyImages = [];
        if (property.images && property.images.length > 0) {
          propertyImages = property.images.map((img, index) => {
            const imageUrl = img.startsWith('http') ? img : `${backendUrl}${img}`;
            return {
              src: imageUrl,
              alt: `Property image ${index + 1}`,
            };
          });
        } else {
          // Fallback to default image
          propertyImages = [{
            src: "/images/listings/list-1.jpg",
            alt: "Default property image",
          }];
        }

        setImages(propertyImages);
      } catch (error) {
        console.error("Error fetching property:", error);
        // Set default image on error
        setImages([{
          src: "/images/listings/list-1.jpg",
          alt: "Default property image",
        }]);
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
      <div className="col-12 text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading images...</span>
        </div>
      </div>
    );
  }
  const mainImage = images[0] || { src: "/images/listings/list-1.jpg", alt: "Property" };
  const thumbnailImages = images.slice(1, 5); // Get up to 4 additional images

  return (
    <>
      <Gallery>
        <div className="col-sm-6">
          <div className="sp-img-content mb15-md">
            <div className="popup-img preview-img-1 sp-img">
              <Item
                original={mainImage.src}
                thumbnail={mainImage.src}
                width={610}
                height={510}
              >
                {({ ref, open }) => (
                  <Image
                    src={mainImage.src}
                    width={591}
                    height={558}
                    ref={ref}
                    onClick={open}
                    alt={mainImage.alt}
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
            {thumbnailImages.length > 0 ? (
              thumbnailImages.map((image, index) => (
                <div className="col-6 ps-sm-0" key={index}>
                  <div className="sp-img-content">
                    <div
                      className={`popup-img preview-img-${index + 2} sp-img mb10`}
                    >
                      <Item
                        original={image.src}
                        thumbnail={image.src}
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
                            src={image.src}
                            alt={image.alt}
                          />
                        )}
                      </Item>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Show placeholder if no additional images
              <div className="col-12 text-center text-white">
                <p className="fz14">No additional images available</p>
              </div>
            )}
          </div>
        </div>
      </Gallery>
    </>
  );
};

export default PropertyGallery;
