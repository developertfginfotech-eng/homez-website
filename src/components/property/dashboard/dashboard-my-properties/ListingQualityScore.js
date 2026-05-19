"use client";
import React, { useState } from "react";

const calculateScore = (property) => {
  const checks = [];

  // Has images (>= 3 images): +20pts
  const images = property.images || property.photos || [];
  const hasImages = Array.isArray(images) && images.length >= 3;
  checks.push({
    passed: hasImages,
    points: 20,
    label: "At least 3 photos",
    tip: "Add at least 3 property photos to attract more buyers.",
  });

  // Has description (>= 100 chars): +15pts
  const description = property.description || "";
  const hasDescription = typeof description === "string" && description.trim().length >= 100;
  checks.push({
    passed: hasDescription,
    points: 15,
    label: "Detailed description (100+ chars)",
    tip: "Write a description of at least 100 characters to help buyers understand the property.",
  });

  // Has price set (price > 0): +15pts
  const price = property.price || property.expectedPrice || 0;
  const hasPrice = Number(price) > 0;
  checks.push({
    passed: hasPrice,
    points: 15,
    label: "Price set",
    tip: "Set a listing price so buyers know the asking amount.",
  });

  // Has at least 3 amenities/features: +15pts
  const amenities = property.amenities || property.features || [];
  const booleanAmenityCount = [
    property.powerBackup,
    property.lift,
    property.parking,
    property.waterStorage,
    property.security,
    property.gym,
    property.swimmingPool,
    property.garden,
    property.clubHouse,
    property.internetWifi,
  ].filter(Boolean).length;
  const totalAmenities = (Array.isArray(amenities) ? amenities.length : 0) + booleanAmenityCount;
  const hasAmenities = totalAmenities >= 3;
  checks.push({
    passed: hasAmenities,
    points: 15,
    label: "At least 3 amenities/features",
    tip: "Add at least 3 amenities or property features to your listing.",
  });

  // Has floor area / size: +10pts
  const hasSize = !!(
    property.sizeInFt ||
    property.superBuiltUpArea ||
    property.carpetArea ||
    property.floorArea ||
    property.area
  );
  checks.push({
    passed: hasSize,
    points: 10,
    label: "Floor area / size specified",
    tip: "Add the property size or floor area so buyers can compare listings.",
  });

  // Has address/location details (city, state): +10pts
  const hasLocation = !!(property.city || property.state || property.neighborhood);
  checks.push({
    passed: hasLocation,
    points: 10,
    label: "City / location details",
    tip: "Add a city or neighborhood so buyers can find your listing on a map.",
  });

  // Has propertyType set: +10pts
  const hasPropertyType = !!(property.propertyType || property.structureType || property.category);
  checks.push({
    passed: hasPropertyType,
    points: 10,
    label: "Property type specified",
    tip: "Set the property type (e.g. Apartment, Villa, Office) to improve search visibility.",
  });

  // Has whatsappUpdates enabled: +5pts
  const hasWhatsapp = !!(property.whatsappUpdates || property.whatsapp);
  checks.push({
    passed: hasWhatsapp,
    points: 5,
    label: "WhatsApp updates enabled",
    tip: "Enable WhatsApp updates so buyers can reach you instantly.",
  });

  const score = checks.filter((c) => c.passed).reduce((sum, c) => sum + c.points, 0);
  const missing = checks.filter((c) => !c.passed);

  return { score, checks, missing };
};

const getScoreLabel = (score) => {
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Work";
};

const getScoreColor = (score) => {
  if (score >= 70) return "#22c55e"; // green
  if (score >= 50) return "#f97316"; // orange
  return "#ef4444"; // red
};

const getBarBg = (score) => {
  if (score >= 70) return "#dcfce7";
  if (score >= 50) return "#ffedd5";
  return "#fee2e2";
};

const ListingQualityScore = ({ property }) => {
  const [expanded, setExpanded] = useState(false);

  if (!property) return null;

  const { score, missing } = calculateScore(property);
  const label = getScoreLabel(score);
  const color = getScoreColor(score);
  const barBg = getBarBg(score);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "14px 16px",
        backgroundColor: "#fff",
        minWidth: "200px",
        maxWidth: "320px",
        fontFamily: "inherit",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Listing Quality</span>
        <span style={{ fontSize: "15px", fontWeight: 700, color }}>
          {score}/100
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          backgroundColor: barBg,
          overflow: "hidden",
          marginBottom: "6px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            backgroundColor: color,
            borderRadius: "4px",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color,
            padding: "2px 8px",
            backgroundColor: barBg,
            borderRadius: "12px",
          }}
        >
          {label}
        </span>

        {missing.length > 0 && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#6b7280",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {expanded ? "Hide" : "What's missing?"}
            <span style={{ fontSize: "10px" }}>{expanded ? "▲" : "▼"}</span>
          </button>
        )}
      </div>

      {/* Expandable missing section */}
      {expanded && missing.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid #f3f4f6",
            paddingTop: "10px",
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            To improve your score:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {missing.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "#fee2e2",
                    color: "#ef4444",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    marginTop: "1px",
                  }}
                >
                  +{item.points}
                </span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{item.tip}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListingQualityScore;
