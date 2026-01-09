"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { propertiesAPI } from "@/services/api";

const ProperytyDescriptions = ({ property: propProperty }) => {
  const [property, setProperty] = useState(propProperty || null);
  const [loading, setLoading] = useState(!propProperty);
  const params = useParams();

  useEffect(() => {
    if (propProperty) {
      setProperty(propProperty);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(params.id);
        if (response.property) {
          setProperty(response.property);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id, propProperty]);

  if (loading) return null;
  if (!property) return null;

  const description = property.description || "No description available.";

  return (
    <>
      <p className="text mb10">
        {description}
      </p>
      <div className="agent-single-accordion">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
              style={{}}
            >
              <div className="accordion-body p-0">
                <p className="text">
                  Placeholder content for this accordion, which is intended to
                  demonstrate the class. This is the first item&apos;s accordion
                  body you get groundbreaking performance and amazing battery
                  life. Add to that a stunning Liquid Retina XDR display, the
                  best camera and audio ever in a Mac notebook, and all the
                  ports you need.
                </p>
              </div>
            </div>
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button p-0 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                Show more
              </button>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProperytyDescriptions;
