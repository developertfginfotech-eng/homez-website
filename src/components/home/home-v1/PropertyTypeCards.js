"use client";
import Link from "next/link";

const PropertyTypeCards = () => {
  const propertyTypes = [
    {
      title: "Buy a Home",
      description: "Find, Buy & Own Your Dream Home",
      icon: "fas fa-home",
      link: "/grid-full-3-col?type=buy",
      bgColor: "#fef2f0",
      iconColor: "#eb6753",
    },
    {
      title: "Rent a Home",
      description: "Find Your Perfect Rental Property",
      icon: "fas fa-key",
      link: "/grid-full-3-col?type=rent",
      bgColor: "#f0f9ff",
      iconColor: "#0284c7",
    },
    {
      title: "PG/Hostel",
      description: "Find Budget-Friendly PG Options",
      icon: "fas fa-bed",
      link: "/grid-full-3-col?type=pg",
      bgColor: "#f0fdf4",
      iconColor: "#16a34a",
    },
    {
      title: "Commercial",
      description: "Buy or Rent Commercial Properties",
      icon: "fas fa-building",
      link: "/grid-full-3-col?type=commercial",
      bgColor: "#fef3c7",
      iconColor: "#f59e0b",
    },
    {
      title: "Plots & Land",
      description: "Buy Residential or Commercial Plots",
      icon: "fas fa-map",
      link: "/grid-full-3-col?type=plots",
      bgColor: "#fae8ff",
      iconColor: "#c026d3",
    },
    {
      title: "Post Property",
      description: "Post Your Property for FREE",
      icon: "fas fa-plus-circle",
      link: "/dashboard-add-property",
      bgColor: "#fef2f0",
      iconColor: "#eb6753",
      highlight: true,
    },
  ];

  return (
    <section className="pt60 pb60">
      <div className="container">
        <div className="row mb40">
          <div className="col-lg-12 text-center">
            <h2 className="title" style={{ fontSize: "32px", fontWeight: "700", color: "#2d3748" }}>
              What are you looking for?
            </h2>
            <p className="text-muted fz16" style={{ marginTop: "10px" }}>
              Choose from our wide variety of properties and locations
            </p>
          </div>
        </div>

        <div className="row g-4">
          {propertyTypes.map((type, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link href={type.link}>
                <div
                  className="property-type-card h-100"
                  style={{
                    backgroundColor: type.bgColor,
                    padding: "30px",
                    borderRadius: "12px",
                    border: type.highlight ? "2px solid #eb6753" : "2px solid transparent",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {type.highlight && (
                    <div
                      className="position-absolute"
                      style={{
                        top: "15px",
                        right: "15px",
                        backgroundColor: "#eb6753",
                        color: "white",
                        padding: "5px 15px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      FREE
                    </div>
                  )}

                  <div className="d-flex align-items-start">
                    <div
                      className="icon-wrapper me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i className={type.icon} style={{ fontSize: "28px", color: type.iconColor }}></i>
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ fontSize: "20px", fontWeight: "700", color: "#2d3748" }}>
                        {type.title}
                      </h4>
                      <p className="mb-0" style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                        {type.description}
                      </p>
                    </div>
                  </div>

                  {type.highlight && (
                    <div className="mt-3">
                      <div
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#eb6753",
                          color: "white",
                          padding: "8px 20px",
                          fontSize: "14px",
                          fontWeight: "600",
                          borderRadius: "6px",
                          border: "none",
                        }}
                      >
                        Post Now <i className="fas fa-arrow-right ms-2"></i>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypeCards;
